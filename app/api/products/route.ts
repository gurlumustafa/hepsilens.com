import { NextRequest } from "next/server";
import { queryMany } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type    = searchParams.get("type");   // 'lens' | 'accessory'
  const color   = searchParams.get("color");  // 'clear' | 'colored'
  const usage   = searchParams.get("usage");  // 'daily' | 'biweekly' | 'monthly'
  const brand   = searchParams.get("brand");  // brand_id
  const accCat  = searchParams.get("cat");    // 'solution' | 'eyedrop'
  const q       = searchParams.get("q");      // full-text search

  const conditions: string[] = ["p.is_active = 1"];
  const params: unknown[]    = [];

  if (type)   { conditions.push("p.product_type = ?");        params.push(type); }
  if (color)  { conditions.push("p.color = ?");               params.push(color); }
  if (usage)  { conditions.push("p.usage_period = ?");        params.push(usage); }
  if (brand)  { conditions.push("p.brand_id = ?");            params.push(brand); }
  if (accCat) { conditions.push("p.accessory_category = ?");  params.push(accCat); }
  if (q)      { conditions.push("MATCH(p.name, p.description) AGAINST (? IN BOOLEAN MODE)"); params.push(q + "*"); }

  const where = conditions.join(" AND ");

  const sql = `
    SELECT
      p.id, p.product_type, p.name, p.brand, p.brand_id,
      p.price, p.original_price, p.rating, p.review_count,
      p.image, p.image_url, p.description, p.badge, p.stock,
      p.color, p.color_name, p.usage_period, p.requires_prescription,
      p.dia, p.bc, p.sph_range,
      p.pack_sizes, p.material, p.water_content, p.oxygen_permeability,
      p.uv_protection, p.tags, p.is_toric, p.cyl_options, p.axis_options,
      p.accessory_category
    FROM products p
    WHERE ${where}
    ORDER BY p.review_count DESC
  `;

  try {
    const rows = await queryMany<Record<string, unknown>>(sql, params);

    // JSON sütunlarını parse et
    const products = rows.map((r) => ({
      ...r,
      pack_sizes:   safeParseJson(r.pack_sizes),
      tags:         safeParseJson(r.tags),
      cyl_options:  safeParseJson(r.cyl_options),
      axis_options: safeParseJson(r.axis_options),
    }));

    return Response.json({ products });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}

function safeParseJson(value: unknown): unknown {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return []; }
  }
  return value; // mysql2 zaten parse ediyor olabilir
}
