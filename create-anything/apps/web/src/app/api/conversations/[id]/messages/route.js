import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;
    const userId = session.user.id;

    // Verify user has access to this conversation
    const conversationCheck = await sql`
      SELECT c.workspace_id 
      FROM conversations c
      JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${conversationId} AND wm.user_id = ${userId}
    `;

    if (conversationCheck.length === 0) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Get messages for this conversation
    const messages = await sql`
      SELECT * FROM messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `;

    return Response.json({ messages });
  } catch (err) {
    console.error("GET /api/conversations/[id]/messages error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { role, content, model_used, token_count = 0 } = body || {};

    if (!role || !content) {
      return Response.json(
        { error: "Role and content are required" },
        { status: 400 },
      );
    }

    // Verify user has access to this conversation
    const conversationCheck = await sql`
      SELECT c.workspace_id 
      FROM conversations c
      JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${conversationId} AND wm.user_id = ${userId}
    `;

    if (conversationCheck.length === 0) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const workspaceId = conversationCheck[0].workspace_id;

    // Create message
    const [message] = await sql`
      INSERT INTO messages (conversation_id, role, content, model_used, token_count)
      VALUES (${conversationId}, ${role}, ${content}, ${model_used || null}, ${Math.floor(token_count) || 0})
      RETURNING *
    `;

    // Update conversation timestamp
    await sql`
      UPDATE conversations 
      SET updated_at = NOW() 
      WHERE id = ${conversationId}
    `;

    // Log usage if this is an AI response
    if (role === "assistant" && model_used && token_count > 0) {
      // Estimate cost (very rough estimates in cents)
      const costPerToken = {
        "gpt-4": 0.003,
        claude: 0.002,
        gemini: 0.0015,
        mistral: 0.001,
      };
      const estimatedCost = Math.ceil(
        Math.floor(token_count) * (costPerToken[model_used] || 0.002) * 100,
      );

      await sql`
        INSERT INTO usage_logs (user_id, workspace_id, model_used, token_count, cost_cents)
        VALUES (${userId}, ${workspaceId}, ${model_used}, ${Math.floor(token_count)}, ${estimatedCost})
      `;
    }

    // Log audit event
    await sql`
      INSERT INTO audit_logs (workspace_id, user_id, action, resource_type, resource_id, details)
      VALUES (${workspaceId}, ${userId}, 'message_sent', 'message', ${message.id}, ${JSON.stringify({ role, model_used })})
    `;

    return Response.json({ message });
  } catch (err) {
    console.error("POST /api/conversations/[id]/messages error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
