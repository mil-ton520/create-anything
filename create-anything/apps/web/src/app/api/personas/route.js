import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return Response.json({ error: 'Workspace ID required' }, { status: 400 });
    }

    // Verify user has access to this workspace
    const [workspace] = await sql`
      SELECT wm.role 
      FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE w.id = ${workspaceId} AND wm.user_id = ${session.user.id}
    `;

    if (!workspace) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const personas = await sql`
      SELECT id, name, system_prompt, avatar_emoji, tags, is_default, created_at
      FROM personas
      WHERE workspace_id = ${workspaceId}
      ORDER BY is_default DESC, created_at DESC
    `;

    return Response.json({ personas });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return Response.json(
      { error: 'Failed to fetch personas' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspace_id, name, system_prompt, avatar_emoji, tags } = await request.json();

    if (!workspace_id || !name || !system_prompt) {
      return Response.json({ 
        error: 'Workspace ID, name, and system prompt are required' 
      }, { status: 400 });
    }

    // Verify user has access to this workspace
    const [workspace] = await sql`
      SELECT wm.role 
      FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE w.id = ${workspace_id} AND wm.user_id = ${session.user.id}
    `;

    if (!workspace) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    const [persona] = await sql`
      INSERT INTO personas (workspace_id, name, system_prompt, avatar_emoji, tags, is_default)
      VALUES (${workspace_id}, ${name}, ${system_prompt}, ${avatar_emoji || '🤖'}, ${tags || []}, false)
      RETURNING id, name, system_prompt, avatar_emoji, tags, is_default, created_at
    `;

    return Response.json({ persona }, { status: 201 });
  } catch (error) {
    console.error('Error creating persona:', error);
    return Response.json(
      { error: 'Failed to create persona' },
      { status: 500 }
    );
  }
}