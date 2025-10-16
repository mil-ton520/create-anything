import sql from "@/app/api/utils/sql";

export async function POST(request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // Get headers from request
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  // Basic header validation
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error("Invalid JSON payload:", error);
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Handle Clerk webhook events
  try {
    console.log("Processing webhook event:", payload.type);

    if (payload.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        payload.data;

      console.log("User created:", {
        id,
        email: email_addresses[0]?.email_address,
      });

      // Create user profile in our database
      await sql`
        INSERT INTO user_profiles (clerk_user_id, display_name, created_at)
        VALUES (${id}, ${`${first_name || ""} ${last_name || ""}`.trim() || "New User"}, now())
        ON CONFLICT (clerk_user_id) DO UPDATE SET
          display_name = EXCLUDED.display_name,
          updated_at = now()
      `;
    }

    if (payload.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        payload.data;

      console.log("User updated:", {
        id,
        email: email_addresses[0]?.email_address,
      });

      // Update user profile
      await sql`
        UPDATE user_profiles 
        SET display_name = ${`${first_name || ""} ${last_name || ""}`.trim() || "User"},
            updated_at = now()
        WHERE clerk_user_id = ${id}
      `;
    }

    if (payload.type === "user.deleted") {
      const { id } = payload.data;

      console.log("User deleted:", { id });

      // Handle user deletion - clean up all user data for GDPR compliance
      await sql.transaction([
        sql`DELETE FROM conversation_presence WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM conversation_shares WHERE clerk_shared_with_user_id = ${id}`,
        sql`DELETE FROM notifications WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM saved_prompts WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM audit_logs WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM usage_logs WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM workspace_members WHERE clerk_user_id = ${id}`,
        sql`DELETE FROM user_profiles WHERE clerk_user_id = ${id}`,
      ]);
    }

    if (payload.type === "session.created") {
      const { user_id } = payload.data;
      console.log("Session created for user:", user_id);

      // Update last seen
      await sql`
        UPDATE user_profiles 
        SET updated_at = now()
        WHERE clerk_user_id = ${user_id}
      `;
    }

    return Response.json({ received: true, type: payload.type });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
