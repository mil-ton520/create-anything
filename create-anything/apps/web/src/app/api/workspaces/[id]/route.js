import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, logo_url } = body;

    // Check if user has permission (owner or admin)
    const [member] = await sql`
      SELECT role
      FROM workspace_members
      WHERE workspace_id = ${id} AND user_id = ${session.user.id}
    `;

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Build update query
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(name.trim());
    }
    if (description !== undefined) {
      updates.push(`description = $${updates.length + 1}`);
      values.push(description.trim());
    }
    if (logo_url !== undefined) {
      updates.push(`logo_url = $${updates.length + 1}`);
      values.push(logo_url);
    }

    if (updates.length === 0) {
      return Response.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push(`updated_at = now()`);
    values.push(id);

    const query = `
      UPDATE workspaces
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const [workspace] = await sql(query, values);

    return Response.json({ workspace });

  } catch (error) {
    console.error("Failed to update workspace:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
