import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return Response.json({ error: "Prompt ID is required" }, { status: 400 });
    }

    // Check if the prompt exists and belongs to the user
    const [prompt] = await sql`
      SELECT * FROM saved_prompts 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (!prompt) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    await sql`
      DELETE FROM saved_prompts 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    return Response.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved prompt:", error);
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
    const { title, content } = await request.json();

    if (!id) {
      return Response.json({ error: "Prompt ID is required" }, { status: 400 });
    }

    // Check if the prompt exists and belongs to the user
    const [existingPrompt] = await sql`
      SELECT * FROM saved_prompts 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (!existingPrompt) {
      return Response.json({ error: "Prompt not found" }, { status: 404 });
    }

    const [updatedPrompt] = await sql`
      UPDATE saved_prompts 
      SET 
        title = ${title || existingPrompt.title},
        content = ${content || existingPrompt.content},
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING *
    `;

    return Response.json({ prompt: updatedPrompt });
  } catch (error) {
    console.error("Error updating saved prompt:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}