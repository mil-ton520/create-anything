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
    const { workspace_id } = body;

    if (!workspace_id) {
      return Response.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this workspace
    const [member] = await sql`
      SELECT id, role
      FROM workspace_members
      WHERE workspace_id = ${workspace_id} AND user_id = ${session.user.id}
    `;

    if (!member) {
      return Response.json(
        { error: "Access denied to this workspace" },
        { status: 403 }
      );
    }

    // Update last accessed timestamp
    await sql`
      UPDATE workspace_members
      SET last_accessed_at = now()
      WHERE workspace_id = ${workspace_id} AND user_id = ${session.user.id}
    `;

    return Response.json({
      success: true,
      workspace_id
    });

  } catch (error) {
    console.error("Failed to switch workspace:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
