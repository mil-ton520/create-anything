import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows =
      await sql`SELECT id, name, email, image, company_name, company_size, industry, country, locale, onboarding_completed FROM auth_users_legacy WHERE id = ${userId} LIMIT 1`;
    const user = rows?.[0] || null;

    return Response.json({ user });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name } = body || {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    // Update the user's name
    const result = await sql`
      UPDATE auth_users_legacy 
      SET name = ${name.trim()}
      WHERE id = ${userId}
      RETURNING id, name, email, image, company_name, company_size, industry, country, locale, onboarding_completed
    `;

    const updated = result?.[0] || null;

    if (!updated) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user: updated });
  } catch (err) {
    console.error("PATCH /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      company_name,
      company_size,
      industry,
      country,
      locale,
      onboarding_completed,
    } = body || {};

    const setClauses = [];
    const values = [];

    if (typeof company_name === "string" && company_name.trim().length > 0) {
      setClauses.push("company_name = $" + (values.length + 1));
      values.push(company_name.trim());
    }

    if (typeof company_size === "string" && company_size.trim().length > 0) {
      setClauses.push("company_size = $" + (values.length + 1));
      values.push(company_size.trim());
    }

    if (typeof industry === "string" && industry.trim().length > 0) {
      setClauses.push("industry = $" + (values.length + 1));
      values.push(industry.trim());
    }

    if (typeof country === "string" && country.trim().length > 0) {
      setClauses.push("country = $" + (values.length + 1));
      values.push(country.trim());
    }

    if (typeof locale === "string" && locale.trim().length > 0) {
      setClauses.push("locale = $" + (values.length + 1));
      values.push(locale.trim());
    }

    if (typeof onboarding_completed === "boolean") {
      setClauses.push("onboarding_completed = $" + (values.length + 1));
      values.push(onboarding_completed);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const finalQuery = `UPDATE auth_users_legacy SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING id, name, email, image, company_name, company_size, industry, country, locale, onboarding_completed`;

    const result = await sql(finalQuery, [...values, userId]);
    const updated = result?.[0] || null;

    return Response.json({ user: updated });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
