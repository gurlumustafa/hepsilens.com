import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({ error: "Tüm alanlar zorunludur" }, { status: 400 });
  }

  if (password.length < 6) {
    return Response.json({ error: "Şifre en az 6 karakter olmalıdır" }, { status: 400 });
  }

  try {
    // E-posta zaten kayıtlı mı?
    const existing = await queryOne("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return Response.json({ error: "Bu e-posta adresi zaten kayıtlı" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const userId = result.insertId;

    // Kullanıcı verisini çek
    const user = await queryOne<{ id: number; name: string; email: string; member_since: string }>(
      "SELECT id, name, email, member_since FROM users WHERE id = ?",
      [userId]
    );

    const headers = new Headers();
    await createSession(
      userId,
      headers,
      req.headers.get("x-forwarded-for") || undefined,
      req.headers.get("user-agent") || undefined
    );

    return new Response(JSON.stringify({ user }), { status: 201, headers });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return Response.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
