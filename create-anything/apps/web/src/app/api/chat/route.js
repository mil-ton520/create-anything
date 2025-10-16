import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, model = "auto", conversation_id } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Model mapping for OpenRouter
    const modelMapping = {
      "gpt-4": "openai/gpt-4-turbo-preview",
      claude: "anthropic/claude-3-opus-20240229",
      gemini: "google/gemini-pro",
      mistral: "mistralai/mistral-large-latest",
      auto: "openai/gpt-4-turbo-preview", // Default to GPT-4 for auto
    };

    const selectedModel = modelMapping[model] || modelMapping["auto"];

    // Simulate AI response for now (replace with actual OpenRouter call)
    const aiResponse = generateMockResponse(
      messages[messages.length - 1].content,
      model,
    );

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming
        const words = aiResponse.split(" ");
        let index = 0;

        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words[index] + (index < words.length - 1 ? " " : "");
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: chunk, done: false })}\n\n`,
              ),
            );
            index++;
            setTimeout(sendChunk, 50); // Simulate typing delay
          } else {
            // Send final chunk with metadata
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  content: "",
                  done: true,
                  model_used: model,
                  token_count: Math.floor(aiResponse.split(" ").length * 1.3), // Ensure integer
                })}\n\n`,
              ),
            );
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("POST /api/chat error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function generateMockResponse(userMessage, model) {
  const responses = {
    "gpt-4": [
      "I'm GPT-4, and I can help you with a wide range of tasks. Your question about '{query}' is interesting. Let me provide a comprehensive analysis...",
      "As an advanced AI model, I can assist with complex reasoning, creative writing, code generation, and detailed explanations. Regarding your query about '{query}', here's my detailed response...",
      "Thank you for your question about '{query}'. As GPT-4, I can provide nuanced, contextual responses. Let me break this down for you...",
    ],
    claude: [
      "Hello! I'm Claude, an AI assistant created by Anthropic. I'd be happy to help with your question about '{query}'. Here's my thoughtful response...",
      "I'm Claude, and I aim to be helpful, harmless, and honest. Your question about '{query}' touches on some important aspects that I'd like to address carefully...",
      "As Claude, I can assist with analysis, writing, math, coding, and creative tasks. Regarding '{query}', let me provide a balanced perspective...",
    ],
    gemini: [
      "I'm Gemini, Google's multimodal AI. Your question about '{query}' is fascinating. Let me provide you with a comprehensive and well-structured response...",
      "As Gemini, I can process text, images, and code effectively. For your query about '{query}', here's my analysis combining multiple perspectives...",
      "Hello! I'm Gemini, and I excel at reasoning across different domains. Your question about '{query}' allows me to demonstrate my analytical capabilities...",
    ],
    mistral: [
      "Bonjour! I'm Mistral AI, and I'm designed to be efficient and precise. Your question about '{query}' is well-posed. Here's my concise yet comprehensive response...",
      "As Mistral, I focus on providing clear, accurate responses. Regarding your query about '{query}', let me give you a structured analysis...",
      "I'm Mistral AI, optimized for European standards and efficiency. Your question about '{query}' deserves a thorough and precise answer...",
    ],
    auto: [
      "I've automatically selected the best model for your query about '{query}'. Based on the content and complexity, here's my optimized response...",
      "Using Auto Mode, I've analyzed your question about '{query}' and chosen the most suitable approach. Here's my response...",
      "Auto Mode has determined the optimal way to handle your query about '{query}'. Let me provide you with the best possible answer...",
    ],
  };

  const modelResponses = responses[model] || responses["auto"];
  const randomResponse =
    modelResponses[Math.floor(Math.random() * modelResponses.length)];

  return randomResponse.replace(
    "{query}",
    userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : ""),
  );
}
