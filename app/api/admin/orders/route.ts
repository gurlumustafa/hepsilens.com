import { NextRequest } from "next/server";
import { queryMany } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const search = searchParams.get("q");
  const page   = Number(searchParams.get("page") || 1);
  const limit  = 20;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[]    = [];

  if (status && status !== "all") {
    conditions.push("o.status = ?");
    params.push(status);
  }
  if (search) {
    conditions.push("(o.customer_name LIKE ? OR o.order_no LIKE ? OR o.customer_email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  try {
    const orders = await queryMany<Record<string, unknown>>(
      `SELECT
        o.id, o.order_no, o.customer_name, o.customer_email, o.customer_phone,
        o.status, o.total_amount, o.pay_method, o.installments, o.card_last4,
        o.ship_city, o.ship_district, o.ship_neighborhood,
        o.ship_postal_code, o.ship_full_address, o.ship_full_name, o.ship_phone,
        o.requires_prescription, o.prescription_status,
        o.tracking_code, o.carrier, o.estimated_delivery, o.shipped_at,
        o.customer_note, o.admin_note, o.created_at,
        GROUP_CONCAT(oi.product_name ORDER BY oi.id SEPARATOR ', ') AS products,
        SUM(oi.quantity) AS total_qty
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return Response.json({ orders });
  } catch (err) {
    console.error("[GET /api/admin/orders]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
