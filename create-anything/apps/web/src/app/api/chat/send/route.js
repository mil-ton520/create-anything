import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

const MODEL_PRICING = {
  "openai/gpt-4o-2024-11-20": { input: 2.5, output: 10.0 },
  "openai/gpt-4o-mini": { input: 0.15, output: 0.6 },
  "anthropic/claude-sonnet-4-20250514": { input: 3.0, output: 15.0 },
  "anthropic/claude-3-5-haiku-20241022": { input: 1.0, output: 5.0 },
  "google/gemini-pro-1.5": { input: 1.25, output: 5.0 },
  "google/gemini-flash-1.5": { input: 0.075, output: 0.3 },
};

function calculateCost(model, inputTokens, outputTokens) {
  const pricing = MODEL_PRICING[model] || { input: 1.0, output: 1.0 };
  const costDollars =
    (inputTokens * pricing.input) / 1000000 +
    (outputTokens * pricing.output) / 1000000;
  return Math.round(costDollars * 100); // Convert to cents
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message, model } = body;

    if (!conversationId || !message?.trim()) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get conversation and verify access
    const conversations = await sql`
      SELECT c.*, wm.user_id
      FROM conversations c
      INNER JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${conversationId}
        AND wm.user_id = ${session.user.id}
    `;

    if (conversations.length === 0) {
      return Response.json(
        { error: "Conversation not found or access denied" },
        { status: 404 },
      );
    }

    const conversation = conversations[0];

    // Auto Mode: Select model based on message content and length
    let selectedModel =
      model || conversation.current_model || "openai/gpt-4o-2024-11-20";

    if (model === "auto") {
      const messageLength = message.length;
      const messageText = message.toLowerCase();

      // Simple tasks - use cheapest model
      if (
        messageLength < 100 ||
        messageText.includes("traduza") ||
        messageText.includes("traduz") ||
        messageText.includes("resume") ||
        messageText.includes("resumo") ||
        messageText.includes("lista")
      ) {
        selectedModel = "google/gemini-flash-1.5";
      }
      // Coding tasks - use balanced model
      else if (
        messageText.includes("código") ||
        messageText.includes("programar") ||
        messageText.includes("javascript") ||
        messageText.includes("python") ||
        messageText.includes("html") ||
        messageText.includes("css")
      ) {
        selectedModel = "openai/gpt-4o-mini";
      }
      // Complex analysis - use premium model
      else if (
        messageLength > 500 ||
        messageText.includes("analisa") ||
        messageText.includes("análise") ||
        messageText.includes("complexo") ||
        messageText.includes("detalhado")
      ) {
        selectedModel = "anthropic/claude-sonnet-4-20250514";
      }
      // Default for medium tasks
      else {
        selectedModel = "anthropic/claude-3-5-haiku-20241022";
      }
    }

    // Get all previous messages for context
    const previousMessages = await sql`
      SELECT role, content
      FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    // Build messages array for OpenRouter
    const openRouterMessages = [
      ...previousMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Call OpenRouter API
    const apiKey =
      "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";

    console.log("Calling OpenRouter with model:", selectedModel);
    console.log("Message count:", openRouterMessages.length);

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.APP_URL || "https://euroai-hub.com",
          "X-Title": "EuroAI Hub",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: openRouterMessages,
        }),
      },
    );

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API error:", {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        body: errorText,
      });

      // Better error messages in Portuguese
      if (openRouterResponse.status === 402) {
        throw new Error(
          "Erro de pagamento: A chave API não tem créditos suficientes. Por favor, adicione créditos em openrouter.ai",
        );
      } else if (openRouterResponse.status === 401) {
        throw new Error("Chave API inválida ou expirada");
      } else if (openRouterResponse.status === 429) {
        throw new Error("Demasiados pedidos. Por favor aguarde um momento.");
      } else {
        throw new Error(
          `Erro da API (${openRouterResponse.status}): ${errorText}`,
        );
      }
    }

    const openRouterData = await openRouterResponse.json();
    console.log("OpenRouter response received, tokens:", openRouterData.usage);

    const aiResponse = openRouterData.choices[0].message.content;
    const usage = openRouterData.usage || {};
    const totalTokens = usage.total_tokens || 0;
    const inputTokens = usage.prompt_tokens || 0;
    const outputTokens = usage.completion_tokens || 0;

    // Calculate cost
    const costCents = calculateCost(selectedModel, inputTokens, outputTokens);

    // Save user message
    const userMessageResult = await sql`
      INSERT INTO messages (conversation_id, workspace_id, role, content, created_at)
      VALUES (${conversationId}, ${conversation.workspace_id}, 'user', ${message}, now())
      RETURNING *
    `;

    const userMessage = userMessageResult[0];

    // Save assistant message
    const assistantMessageResult = await sql`
      INSERT INTO messages (
        conversation_id,
        workspace_id,
        role,
        content,
        model_used,
        tokens,
        cost_cents,
        created_at
      )
      VALUES (
        ${conversationId},
        ${conversation.workspace_id},
        'assistant',
        ${aiResponse},
        ${selectedModel},
        ${totalTokens},
        ${costCents},
        now()
      )
      RETURNING *
    `;

    const assistantMessage = assistantMessageResult[0];

    // Update conversation timestamp and model
    await sql`
      UPDATE conversations
      SET updated_at = now(), current_model = ${selectedModel}
      WHERE id = ${conversationId}
    `;

    // Log usage for analytics
    await sql`
      INSERT INTO usage_logs (
        user_id,
        workspace_id,
        model_used,
        token_count,
        cost_cents,
        created_at
      )
      VALUES (
        ${session.user.id},
        ${conversation.workspace_id},
        ${selectedModel},
        ${totalTokens},
        ${costCents},
        now()
      )
    `;

    return Response.json({
      success: true,
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error("Chat send error:", error);
    return Response.json(
      { error: error.message || "Failed to send message" },
      { status: 500 },
    );
  }
}
