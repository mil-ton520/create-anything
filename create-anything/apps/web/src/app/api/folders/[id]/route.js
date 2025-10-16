import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, color } = await request.json();

    // Verify user has access to this folder
    const [folder] = await sql`
      SELECT pf.*, wm.role 
      FROM project_folders pf
      JOIN workspace_members wm ON wm.workspace_id = pf.workspace_id
      WHERE pf.id = ${id} AND wm.user_id = ${session.user.id}
    `;

    if (!folder) {
      return Response.json({ error: 'Folder not found or access denied' }, { status: 404 });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.description = color; // Store color in description field

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'No updates provided' }, { status: 400 });
    }

    let updateQuery = 'UPDATE project_folders SET ';
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      updateFields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    updateQuery += updateFields.join(', ');
    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, name, description as color, created_at`;
    values.push(id);

    const [updatedFolder] = await sql(updateQuery, values);

    return Response.json({ folder: updatedFolder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return Response.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify user has access to this folder
    const [folder] = await sql`
      SELECT pf.*, wm.role 
      FROM project_folders pf
      JOIN workspace_members wm ON wm.workspace_id = pf.workspace_id
      WHERE pf.id = ${id} AND wm.user_id = ${session.user.id}
    `;

    if (!folder) {
      return Response.json({ error: 'Folder not found or access denied' }, { status: 404 });
    }

    // Move conversations out of folder before deleting
    await sql`
      UPDATE conversations 
      SET folder_id = NULL 
      WHERE folder_id = ${id}
    `;

    await sql`
      DELETE FROM project_folders 
      WHERE id = ${id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return Response.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}