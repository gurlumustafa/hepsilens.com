import { queryOne } from "@/lib/db";

export async function GET() {
  try {
    const stats = await queryOne<{
      total_users: number;
      new_orders: number;
      active_orders: number;
      open_tickets: number;
      today_revenue: number;
    }>(
      `SELECT
        (SELECT COUNT(*) FROM users WHERE is_anonymous = 0)                          AS total_users,
        (SELECT COUNT(*) FROM orders WHERE status = 'yeni')                          AS new_orders,
        (SELECT COUNT(*) FROM orders WHERE status NOT IN ('teslim','iptal'))         AS active_orders,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'acik')                 AS open_tickets,
        (SELECT COALESCE(SUM(total_amount),0) FROM orders
         WHERE DATE(created_at) = CURDATE() AND status != 'iptal')                  AS today_revenue`
    );

    return Response.json({ stats });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
