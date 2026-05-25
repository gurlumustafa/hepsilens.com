import { queryMany } from "@/lib/db";

export async function GET() {
  try {
    const brands = await queryMany(
      "SELECT id, name FROM brands WHERE is_active = 1 ORDER BY name"
    );
    return Response.json({ brands });
  } catch (err) {
    console.error("[GET /api/brands]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
