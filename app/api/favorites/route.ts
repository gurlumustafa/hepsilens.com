import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { execute } from "@/lib/db";

// POST /api/favorites  — favori ekle/çıkar (toggle)
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return Response.json({ error: "productId gerekli" }, { status: 400 });

  try {
    // Zaten varsa sil, yoksa ekle
    const result = await execute(
      "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
      [user.id, productId]
    );

    if (result.affectedRows === 0) {
      // Silinecek yoktu → ekle
      await execute(
        "INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)",
        [user.id, productId]
      );
      return Response.json({ action: "added" });
    }
    return Response.json({ action: "removed" });
  } catch (err) {
    console.error("[POST /api/favorites]", err);
    return Response.json({ error: "DB hatası" }, { status: 500 });
  }
}
