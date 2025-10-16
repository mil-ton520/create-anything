import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      return Response.json(
        { error: "Workspace name must be between 3 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate name - only alphanumeric, spaces, hyphens, underscores
    const nameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!nameRegex.test(name.trim())) {
      return Response.json(
        { error: "Workspace name can only contain letters, numbers, spaces, hyphens, and underscores" },
        { status: 400 }
      );
    }

    if (description && description.length > 500) {
      return Response.json(
        { error: "Description must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Create workspace
    const [workspace] = await sql`
      INSERT INTO workspaces (name, description, created_by, plan)
      VALUES (${name.trim()}, ${description?.trim() || null}, ${session.user.id}, 'free')
      RETURNING *
    `;

    // Add user as owner to workspace_members
    await sql`
      INSERT INTO workspace_members (workspace_id, user_id, role, last_accessed_at)
      VALUES (${workspace.id}, ${session.user.id}, 'owner', now())
    `;

    return Response.json({
      success: true,
      workspace
    });

  } catch (error) {
    console.error("Failed to create workspace:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
