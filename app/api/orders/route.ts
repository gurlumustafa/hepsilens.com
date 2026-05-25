import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { execute, queryMany } from "@/lib/db";

// GET /api/orders — kullanıcının siparişleri (kalemleriyle)
export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

  const orders = await queryMany<Record<string, unknown>>(
    `SELECT o.id, o.order_no, o.status, o.total_amount, o.created_at,
            o.tracking_code, o.carrier, o.estimated_delivery
     FROM orders o
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [user.id]
  );

  // Her sipariş için kalemleri çek
  for (const order of orders) {
    order.items = await queryMany(
      "SELECT product_name, product_brand, unit_price, quantity, subtotal FROM order_items WHERE order_id = ?",
      [order.id]
    );
  }

  return Response.json({ orders });
}

// POST /api/orders — yeni sipariş oluştur
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const body = await req.json();

  const {
    items,           // [{ productId, name, brand, price, quantity }]
    contact,         // { fullName, email, phone }
    address,         // { city, district, postalCode, fullAddress }
    payMethod,
    cardLast4,
    installments,
    customerNote,
  } = body;

  if (!items?.length || !contact?.fullName || !contact?.phone || !address?.city) {
    return Response.json({ error: "Eksik sipariş bilgisi" }, { status: 400 });
  }

  const subtotal    = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const shipping    = subtotal >= 500 ? 0 : 39;
  const totalAmount = subtotal + shipping;

  // Sipariş no üret: HL-YYYY-XXXX
  const year    = new Date().getFullYear();
  const randNum = String(Math.floor(Math.random() * 90000) + 10000);
  const orderNo = `HL-${year}-${randNum}`;

  try {
    const result = await execute(
      `INSERT INTO orders (
        order_no, user_id,
        customer_name, customer_email, customer_phone,
        subtotal, shipping_cost, total_amount,
        ship_full_name, ship_phone, ship_city, ship_district,
        ship_postal_code, ship_full_address,
        pay_method, installments, card_last4,
        customer_note
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        orderNo, user?.id ?? null,
        contact.fullName, contact.email ?? null, contact.phone,
        subtotal, shipping, totalAmount,
        contact.fullName, contact.phone, address.city, address.district,
        address.postalCode ?? null, address.fullAddress,
        payMethod ?? "credit_card", installments ?? null, cardLast4 ?? null,
        customerNote ?? null,
      ]
    );

    const orderId = result.insertId;

    // Kalemleri ekle
    for (const item of items) {
      await execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_brand, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId ?? null, item.name, item.brand ?? null, item.price, item.quantity, item.price * item.quantity]
      );
    }

    return Response.json({ orderNo, orderId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return Response.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
