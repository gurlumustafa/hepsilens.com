import { NextRequest } from "next/server";
import { queryOne, queryMany } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) return Response.json({ error: "Geçersiz ID" }, { status: 400 });

  try {
    const product = await queryOne<Record<string, unknown>>(
      `SELECT
        p.*,
        b.name AS brand_full_name, b.logo, b.banner_image, b.banner_bg, b.tagline
       FROM products p
       LEFT JOIN brands b ON b.id = p.brand_id
       WHERE p.id = ? AND p.is_active = 1`,
      [productId]
    );

    if (!product) return Response.json({ error: "Ürün bulunamadı" }, { status: 404 });

    const reviews = await queryMany<Record<string, unknown>>(
      `SELECT id, user_name, rating, comment, helpful_count, verified, created_at
       FROM reviews
       WHERE product_id = ?
       ORDER BY created_at DESC`,
      [productId]
    );

    // Benzer ürünler (aynı tip & aktif, kendisi hariç, max 4)
    const related = await queryMany<Record<string, unknown>>(
      `SELECT id, name, brand, price, original_price, image_url, badge, rating
       FROM products
       WHERE is_active = 1 AND id != ?
         AND product_type = ?
       ORDER BY review_count DESC
       LIMIT 4`,
      [productId, product.product_type]
    );

    const jsonFields = ["pack_sizes", "tags", "cyl_options", "axis_options"];
    for (const f of jsonFields) {
      product[f] = safeParseJson(product[f]);
    }

    return Response.json({ product, reviews, related });
  } catch (err) {
    console.error("[GET /api/products/[id]]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}

function safeParseJson(value: unknown): unknown {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return []; }
  }
  return value;
}
