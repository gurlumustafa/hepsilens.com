import { NextRequest } from "next/server";
import { queryMany } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const conditions: string[] = [];
  const params: unknown[]    = [];

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }

  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  try {
    const tickets = await queryMany(
      `SELECT id, ticket_no, user_id, name, email, phone,
              subject, message, status, priority, category,
              admin_reply, created_at, updated_at
       FROM support_tickets
       ${where}
       ORDER BY
         CASE priority WHEN 'kritik' THEN 0 WHEN 'yuksek' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
         created_at DESC
       LIMIT 50`,
      params
    );
    return Response.json({ tickets });
  } catch (err) {
    console.error("[GET /api/admin/tickets]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
