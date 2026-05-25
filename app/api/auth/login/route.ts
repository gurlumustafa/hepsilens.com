import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "E-posta ve şifre zorunludur" }, { status: 400 });
  }

  try {
    const user = await queryOne<{
      id: number; name: string; email: string; phone: string | null;
      password_hash: string; is_anonymous: number; member_since: string;
      notif_email: number; notif_sms: number;
    }>(
      "SELECT id, name, email, phone, password_hash, is_anonymous, member_since, notif_email, notif_sms FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (!user || !user.password_hash) {
      return Response.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return Response.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
    }

    const { password_hash: _, ...safeUser } = user;

    const headers = new Headers();
    await createSession(
      user.id,
      headers,
      req.headers.get("x-forwarded-for") || undefined,
      req.headers.get("user-agent") || undefined
    );

    return new Response(JSON.stringify({ user: safeUser }), { status: 200, headers });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return Response.json({ error: "Giriş başarısız" }, { status: 500 });
  }
}
