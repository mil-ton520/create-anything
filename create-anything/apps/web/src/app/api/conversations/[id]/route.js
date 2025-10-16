import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return Response.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    // Get conversation details
    const conversation = await sql`
      SELECT c.*
      FROM conversations c
      JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${id} AND wm.user_id = ${session.user.id}
    `;

    if (conversation.length === 0) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return Response.json({ conversation: conversation[0] });
  } catch (error) {
    console.error("Failed to get conversation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return Response.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, current_model, is_pinned, is_archived } = body;

    // Verify access
    const conversationCheck = await sql`
      SELECT c.id, c.workspace_id 
      FROM conversations c
      JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${id} AND wm.user_id = ${session.user.id}
    `;

    if (conversationCheck.length === 0) {
      return Response.json(
        { error: "Conversation not found or access denied" },
        { status: 404 },
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (current_model !== undefined) {
      updates.push(`current_model = $${paramIndex++}`);
      values.push(current_model);
    }
    if (is_pinned !== undefined) {
      updates.push(`is_pinned = $${paramIndex++}`);
      values.push(is_pinned);
    }
    if (is_archived !== undefined) {
      updates.push(`is_archived = $${paramIndex++}`);
      values.push(is_archived);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = now()`);
    values.push(id);

    const query = `UPDATE conversations SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql(query, values);

    return Response.json({ success: true, conversation: result[0] });
  } catch (error) {
    console.error("Failed to update conversation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return Response.json(
        { error: "Conversation ID is required" },
        { status: 400 },
      );
    }

    console.log(
      `🗑️ Attempting to delete conversation ${id} for user ${session.user.id}`,
    );

    // Verify the conversation belongs to a workspace the user has access to
    const conversationCheck = await sql`
      SELECT c.id, c.workspace_id, c.title
      FROM conversations c
      JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
      WHERE c.id = ${id} AND wm.user_id = ${session.user.id}
    `;

    console.log("🔍 Conversation check result:", conversationCheck);

    if (conversationCheck.length === 0) {
      console.log(
        `❌ Conversation ${id} not found or access denied for user ${session.user.id}`,
      );
      return Response.json(
        { error: "Conversa não encontrada ou acesso negado" },
        { status: 404 },
      );
    }

    const conversation = conversationCheck[0];
    console.log(`📝 Found conversation: "${conversation.title}"`);

    // First check if there are messages that would prevent deletion
    const messageCount = await sql`
      SELECT COUNT(*) as count FROM messages WHERE conversation_id = ${id}
    `;
    console.log(`💬 Messages in conversation: ${messageCount[0].count}`);

    // Delete the conversation (messages should be deleted due to CASCADE)
    const deleteResult = await sql`
      DELETE FROM conversations 
      WHERE id = ${id}
      RETURNING id, title
    `;

    console.log("🗑️ Delete result:", deleteResult);

    if (deleteResult.length === 0) {
      throw new Error("Falha ao eliminar conversa - nenhuma linha afetada");
    }

    console.log(
      `✅ Successfully deleted conversation "${deleteResult[0].title}"`,
    );

    return Response.json({
      success: true,
      message: "Conversa eliminada com sucesso",
      deletedId: parseInt(id),
    });
  } catch (error) {
    console.error("❌ Failed to delete conversation:", error);

    // More specific error messages
    if (error.message?.includes("foreign key")) {
      return Response.json(
        { error: "Não é possível eliminar a conversa devido a dependências" },
        { status: 400 },
      );
    }

    return Response.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 },
    );
  }
}
