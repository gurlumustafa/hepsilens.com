import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { execute } from "@/lib/db";

// DELETE /api/addresses/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

  const { id } = await params;
  await execute("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, user.id]);
  return Response.json({ ok: true });
}

// PATCH /api/addresses/[id] — varsayılan yap veya güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Oturum gerekli" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (body.is_default) {
    await execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user.id]);
    await execute("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?", [id, user.id]);
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
