import { getSessionUser } from "@/lib/session";
import { queryMany } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ user: null }, { status: 401 });

  // Favorileri de getir
  const favRows = await queryMany<{ product_id: number }>(
    "SELECT product_id FROM favorites WHERE user_id = ?",
    [user.id]
  );
  const favorites = favRows.map((r) => r.product_id);

  // Adresleri getir
  const addresses = await queryMany(
    "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
    [user.id]
  );

  // Siparişleri getir (kaleme breakdown ile)
  const orders = await queryMany(
    `SELECT o.id, o.order_no, o.status, o.total_amount, o.created_at,
            o.tracking_code, o.carrier
     FROM orders o
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [user.id]
  );

  return Response.json({ user, favorites, addresses, orders });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

  const body = await req.json();
  const { name, email, phone, notif_email, notif_sms } = body;

  const { execute } = await import("@/lib/db");
  await execute(
    `UPDATE users SET
      name        = COALESCE(?, name),
      email       = COALESCE(?, email),
      phone       = COALESCE(?, phone),
      notif_email = COALESCE(?, notif_email),
      notif_sms   = COALESCE(?, notif_sms)
     WHERE id = ?`,
    [name ?? null, email ?? null, phone ?? null, notif_email ?? null, notif_sms ?? null, user.id]
  );

  return Response.json({ ok: true });
}
