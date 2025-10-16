import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspace_id");

    if (!workspaceId) {
      return Response.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Verify user has access to this workspace
    const memberCheck = await sql`
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = ${workspaceId} AND user_id = ${userId}
    `;

    if (memberCheck.length === 0) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Get conversations with latest message preview
    const conversations = await sql`
      SELECT 
        c.*,
        (
          SELECT content 
          FROM messages m 
          WHERE m.conversation_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message_preview
      FROM conversations c
      WHERE c.workspace_id = ${workspaceId}
      ORDER BY c.updated_at DESC
      LIMIT 50
    `;

    return Response.json({ conversations });
  } catch (err) {
    console.error("GET /api/conversations error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { workspace_id, title, folder_id, model } = body || {};

    if (!workspace_id) {
      return Response.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    const conversationTitle = title?.trim() || "New Conversation";

    // Verify user has access to this workspace
    const memberCheck = await sql`
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = ${workspace_id} AND user_id = ${userId}
    `;

    if (memberCheck.length === 0) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Create conversation with model support
    const [conversation] = await sql`
      INSERT INTO conversations (
        workspace_id, 
        folder_id, 
        title, 
        created_by,
        current_model,
        created_at,
        updated_at
      )
      VALUES (
        ${workspace_id}, 
        ${folder_id || null}, 
        ${conversationTitle}, 
        ${userId},
        ${model || "openai/gpt-4o-2024-11-20"},
        now(),
        now()
      )
      RETURNING *
    `;

    // Log audit event
    await sql`
      INSERT INTO audit_logs (workspace_id, user_id, action, resource_type, resource_id)
      VALUES (${workspace_id}, ${userId}, 'conversation_created', 'conversation', ${conversation.id})
    `;

    return Response.json({ conversation });
  } catch (err) {
    console.error("POST /api/conversations error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
