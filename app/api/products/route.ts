import { NextRequest } from "next/server";
import { queryMany, execute } from "@/lib/db";

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

/* ─── POST /api/products — Yeni ürün ekle ─────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    const {
      productType, name, brand, brandId,
      price, originalPrice, stock, badge,
      imageUrl, description, tags,
      // lens
      color, colorName, usagePeriod, requiresPrescription,
      dia, bc, sphRange, material, waterContent, oxygenPermeability,
      uvProtection, packSizes, isToric, cylOptions, axisOptions,
      // accessory
      accessoryCategory,
    } = body as {
      productType: string; name: string; brand: string; brandId: string;
      price: string; originalPrice: string; stock: string; badge: string;
      imageUrl: string; description: string; tags: string;
      color: string; colorName: string; usagePeriod: string; requiresPrescription: boolean;
      dia: string; bc: string; sphRange: string; material: string;
      waterContent: string; oxygenPermeability: string; uvProtection: boolean;
      packSizes: string; isToric: boolean; cylOptions: string; axisOptions: string;
      accessoryCategory: string;
    };

    if (!name?.trim() || !productType || !price || !stock) {
      return Response.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    // Virgülle ayrılmış stringleri JSON array'e dönüştür
    const parseCsv = (s: string) =>
      (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
    const parseCsvNumbers = (s: string) =>
      parseCsv(s).map(Number).filter((n) => !isNaN(n));

    const tagsArr      = parseCsv(tags ?? "");
    const packSizesArr = parseCsvNumbers(packSizes ?? "");
    const cylArr       = parseCsvNumbers(cylOptions ?? "");
    const axisArr      = parseCsvNumbers(axisOptions ?? "");

    const isLens      = productType === "lens";
    const isAccessory = productType === "accessory";

    const result = await execute(
      `INSERT INTO products (
        product_type, name, brand, brand_id,
        price, original_price, stock, badge,
        image_url, description, tags,
        color, color_name, usage_period, requires_prescription,
        dia, bc, sph_range, material, water_content, oxygen_permeability,
        uv_protection, pack_sizes, is_toric, cyl_options, axis_options,
        accessory_category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productType,
        name.trim(),
        brand,
        brandId || null,
        parseFloat(price),
        originalPrice ? parseFloat(originalPrice) : null,
        parseInt(stock, 10),
        badge?.trim() || null,
        imageUrl?.trim() || null,
        description?.trim() || null,
        JSON.stringify(tagsArr),
        isLens ? (color ?? null) : null,
        isLens ? (colorName?.trim() || null) : null,
        isLens ? (usagePeriod ?? null) : null,
        isLens ? (requiresPrescription ? 1 : 0) : 0,
        isLens ? (dia ? parseFloat(dia) : null) : null,
        isLens ? (bc  ? parseFloat(bc)  : null) : null,
        isLens ? (sphRange?.trim() || null) : null,
        isLens ? (material?.trim() || null) : null,
        isLens ? (waterContent ? parseInt(waterContent, 10) : null) : null,
        isLens ? (oxygenPermeability ? parseFloat(oxygenPermeability) : null) : null,
        isLens ? (uvProtection ? 1 : 0) : 0,
        isLens ? JSON.stringify(packSizesArr) : null,
        isLens ? (isToric ? 1 : 0) : 0,
        isLens && isToric ? JSON.stringify(cylArr) : null,
        isLens && isToric ? JSON.stringify(axisArr) : null,
        isAccessory ? (accessoryCategory ?? null) : null,
      ]
    );

    return Response.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
