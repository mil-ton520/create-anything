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

    const folders = await sql`
      SELECT 
        pf.*,
        COUNT(c.id) as conversation_count
      FROM project_folders pf
      LEFT JOIN conversations c ON c.folder_id = pf.id
      WHERE pf.workspace_id = ${workspaceId}
      GROUP BY pf.id
      ORDER BY pf.created_at DESC
    `;

    return Response.json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return Response.json(
      { error: 'Failed to fetch folders' },
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

    const { workspace_id, name, color } = await request.json();

    if (!workspace_id || !name) {
      return Response.json({ 
        error: 'Workspace ID and name are required' 
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

    // Default colors cycle
    const colors = ['blue-500', 'green-500', 'purple-500', 'orange-500', 'pink-500'];
    const randomColor = color || colors[Math.floor(Math.random() * colors.length)];

    const [folder] = await sql`
      INSERT INTO project_folders (workspace_id, name, description, created_by)
      VALUES (${workspace_id}, ${name}, ${randomColor}, ${session.user.id})
      RETURNING id, name, description as color, created_at
    `;

    return Response.json({ folder: { ...folder, conversation_count: 0 } }, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return Response.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}