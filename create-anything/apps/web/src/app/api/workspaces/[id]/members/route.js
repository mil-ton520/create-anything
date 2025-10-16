import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify user has access to this workspace
    const [access] = await sql`
      SELECT id
      FROM workspace_members
      WHERE workspace_id = ${id} AND user_id = ${session.user.id}
    `;

    if (!access) {
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get all members with user details
    const members = await sql`
      SELECT 
        wm.id,
        wm.role,
        wm.joined_at,
        u.id as user_id,
        u.name,
        u.email
      FROM workspace_members wm
      JOIN auth_users_legacy u ON wm.user_id = u.id
      WHERE wm.workspace_id = ${id}
      ORDER BY 
        CASE wm.role
          WHEN 'owner' THEN 1
          WHEN 'admin' THEN 2
          WHEN 'member' THEN 3
          ELSE 4
        END,
        wm.joined_at ASC
    `;

    return Response.json({ members });

  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
