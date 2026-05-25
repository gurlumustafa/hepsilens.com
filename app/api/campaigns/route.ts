import { queryMany } from "@/lib/db";

export async function GET() {
  try {
    const campaigns = await queryMany(
      `SELECT * FROM campaigns
       WHERE is_active = 1
         AND (valid_from IS NULL OR valid_from <= NOW())
         AND (valid_until IS NULL OR valid_until >= NOW())
       ORDER BY display_order ASC`
    );
    return Response.json({ campaigns });
  } catch (err) {
    console.error("[GET /api/campaigns]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
