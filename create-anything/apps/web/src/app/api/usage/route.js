import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current workspace
    const [currentWorkspace] = await sql`
      SELECT w.id, w.name
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = ${userId}
      ORDER BY wm.last_accessed_at DESC NULLS LAST
      LIMIT 1
    `;

    if (!currentWorkspace) {
      return Response.json({ error: "No workspace found" }, { status: 404 });
    }

    // Get this month's usage
    const usageStats = await sql`
      SELECT 
        COUNT(*) as messages,
        COALESCE(SUM(token_count), 0) as tokens,
        COALESCE(SUM(cost_cents), 0) as cost_cents
      FROM usage_logs
      WHERE workspace_id = ${currentWorkspace.id}
        AND created_at >= date_trunc('month', CURRENT_DATE)
    `;

    // Get daily usage for the last 30 days
    const dailyUsage = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as messages,
        COALESCE(SUM(token_count), 0) as tokens,
        COALESCE(SUM(cost_cents), 0) as cost_cents
      FROM usage_logs
      WHERE workspace_id = ${currentWorkspace.id}
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    return Response.json({
      messages: Number(usageStats[0]?.messages || 0),
      tokens: Number(usageStats[0]?.tokens || 0),
      cost_cents: Number(usageStats[0]?.cost_cents || 0),
      history: dailyUsage.map((day) => ({
        date: new Date(day.date).toLocaleDateString('pt-PT'),
        messages: Number(day.messages),
        tokens: Number(day.tokens),
        cost_cents: Number(day.cost_cents),
      })),
    });
  } catch (err) {
    console.error("GET /api/usage error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
