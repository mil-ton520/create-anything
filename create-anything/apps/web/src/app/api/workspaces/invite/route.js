import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

function generateInviteToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspace_id, email, role = "member" } = body;

    if (!workspace_id || !email) {
      return Response.json(
        { error: "Workspace ID and email are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user has permission to invite to this workspace
    const [memberCheck] = await sql`
      SELECT role 
      FROM workspace_members 
      WHERE workspace_id = ${workspace_id} AND user_id = ${session.user.id}
    `;

    if (
      !memberCheck ||
      (memberCheck.role !== "owner" && memberCheck.role !== "admin")
    ) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if user being invited already exists and is a member
    const [existingUser] = await sql`
      SELECT u.id, u.name, u.email 
      FROM auth_users_legacy u
      WHERE u.email = ${email}
    `;

    if (existingUser) {
      const [existingMember] = await sql`
        SELECT id 
        FROM workspace_members 
        WHERE workspace_id = ${workspace_id} AND user_id = ${existingUser.id}
      `;

      if (existingMember) {
        return Response.json(
          { error: "User is already a member of this workspace" },
          { status: 400 },
        );
      }
    }

    // Check for existing pending invite
    const [existingInvite] = await sql`
      SELECT id 
      FROM pending_workspace_invites 
      WHERE workspace_id = ${workspace_id} 
        AND email = ${email}
        AND accepted_at IS NULL
        AND expires_at > now()
    `;

    if (existingInvite) {
      return Response.json(
        { error: "An invite has already been sent to this email" },
        { status: 400 },
      );
    }

    // Generate unique invite token
    const inviteToken = generateInviteToken();

    // Create pending invite
    const [invite] = await sql`
      INSERT INTO pending_workspace_invites (
        workspace_id, 
        email, 
        role, 
        invited_by, 
        invite_token
      )
      VALUES (${workspace_id}, ${email}, ${role}, ${session.user.id}, ${inviteToken})
      RETURNING *
    `;

    return Response.json({
      success: true,
      message: "Invitation sent successfully",
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        invite_url: `${process.env.APP_URL}/invite/${inviteToken}`,
      },
    });
  } catch (error) {
    console.error("Failed to invite team member:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
