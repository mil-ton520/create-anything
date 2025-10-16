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

    // Get pending invites
    const invites = await sql`
      SELECT 
        id,
        email,
        role,
        created_at,
        expires_at
      FROM pending_workspace_invites
      WHERE workspace_id = ${id}
        AND accepted_at IS NULL
        AND expires_at > now()
      ORDER BY created_at DESC
    `;

    return Response.json({ invites });

  } catch (error) {
    console.error("Failed to fetch pending invites:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
