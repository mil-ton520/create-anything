import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get workspaces where user is a member with member count and ordering
    const workspaces = await sql`
      SELECT 
        w.*, 
        ws.plan_type as plan, 
        ws.monthly_word_limit, 
        ws.user_limit, 
        wm.role,
        wm.last_accessed_at,
        (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id) as member_count
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      LEFT JOIN workspace_settings ws ON w.id = ws.workspace_id
      WHERE wm.user_id = ${userId}
      ORDER BY wm.last_accessed_at DESC NULLS LAST, w.created_at DESC
    `;

    return Response.json({ workspaces });
  } catch (err) {
    console.error("GET /api/workspaces error", err);
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
    const { name, description, plan_type = "starter" } = body || {};

    if (!name || name.trim().length === 0) {
      return Response.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    const wordLimits = {
      starter: 500000,
      business: null, // unlimited
    };

    const userLimits = {
      starter: 10,
      business: 25,
    };

    // Create workspace, member, and settings in a single transaction
    const [workspaceResult, memberResult, settingsResult] =
      await sql.transaction([
        sql`
        INSERT INTO workspaces (name, description, created_by)
        VALUES (${name.trim()}, ${description || ""}, ${userId})
        RETURNING *
      `,
        sql`
        INSERT INTO workspace_members (workspace_id, user_id, role)
        SELECT currval('workspaces_id_seq'), ${userId}, 'admin'
        RETURNING *
      `,
        sql`
        INSERT INTO workspace_settings (workspace_id, plan_type, monthly_word_limit, user_limit)
        SELECT currval('workspaces_id_seq'), ${plan_type}, ${wordLimits[plan_type]}, ${userLimits[plan_type]}
        RETURNING *
      `,
      ]);

    const workspace = workspaceResult[0];
    return Response.json({ workspace });
  } catch (err) {
    console.error("POST /api/workspaces error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
