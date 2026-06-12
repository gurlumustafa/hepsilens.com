import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { execute } from "@/lib/db";

// POST /api/addresses — yeni adres ekle
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

    const { title, full_name, phone, city, district, neighborhood, postal_code, full_address, is_default } = await req.json();

    if (!title || !full_name || !city || !district || !full_address) {
      return Response.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    // Varsayılan yapılacaksa diğerleri sıfırla
    if (is_default) {
      await execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user.id]);
    }

    const result = await execute(
      `INSERT INTO addresses (user_id, title, full_name, phone, city, district, neighborhood, postal_code, full_address, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, title, full_name, phone ?? null, city, district, neighborhood ?? null, postal_code ?? null, full_address, is_default ? 1 : 0]
    );

    return Response.json({ id: result.insertId }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/addresses]", msg);
    return Response.json({ error: "DB hatası", detail: msg }, { status: 500 });
  }
}
