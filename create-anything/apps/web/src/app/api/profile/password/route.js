import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { hash, verify } from "argon2";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Get user's current password from auth_accounts
    const [account] = await sql`
      SELECT password
      FROM auth_accounts_legacy
      WHERE "userId" = ${session.user.id}
        AND type = 'credentials'
        AND provider = 'credentials'
    `;

    if (!account || !account.password) {
      return Response.json(
        { error: "No password found for this account" },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await verify(account.password, currentPassword);
    if (!isValid) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword);

    // Update password
    await sql`
      UPDATE auth_accounts_legacy
      SET password = ${hashedPassword}
      WHERE "userId" = ${session.user.id}
        AND type = 'credentials'
        AND provider = 'credentials'
    `;

    return Response.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("POST /api/profile/password error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
