import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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

    const prompts = await sql`
      SELECT sp.*, au.name as user_name
      FROM saved_prompts sp
      JOIN auth_users au ON sp.user_id = au.id
      WHERE sp.workspace_id = ${workspaceId}
      ORDER BY sp.created_at DESC
    `;

    return Response.json({ prompts });
  } catch (error) {
    console.error("Error fetching saved prompts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspace_id, title, content } = await request.json();

    if (!workspace_id || !title?.trim() || !content?.trim()) {
      return Response.json(
        {
          error: "Workspace ID, title, and content are required",
        },
        { status: 400 },
      );
    }

    // Check if user is member of workspace
    const membershipCheck = await sql`
      SELECT id FROM workspace_members 
      WHERE workspace_id = ${workspace_id} AND user_id = ${session.user.id}
    `;

    if (membershipCheck.length === 0) {
      return Response.json(
        {
          error: "User is not a member of this workspace",
        },
        { status: 403 },
      );
    }

    const [prompt] = await sql`
      INSERT INTO saved_prompts (workspace_id, user_id, title, content)
      VALUES (${workspace_id}, ${session.user.id}, ${title.trim()}, ${content.trim()})
      RETURNING *
    `;

    return Response.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error("Error creating saved prompt:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
