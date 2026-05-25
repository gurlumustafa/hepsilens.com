import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code       = searchParams.get("code");
  const state      = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/hesap/giris?error=${reason}`);

  // Kullanıcı erişimi reddetti
  if (errorParam || !code) return fail("google_denied");

  // CSRF: state doğrula
  const storedState = req.cookies.get("google_oauth_state")?.value;
  if (!storedState || storedState !== state) return fail("state_mismatch");

  try {
    /* ── 1. Code → Access Token ───────────────────────────────── */
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  `${origin}/api/auth/google/callback`,
        grant_type:    "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) return fail("token_exchange");

    /* ── 2. Kullanıcı bilgisi ─────────────────────────────────── */
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const gUser = await userRes.json();

    if (!gUser.email) return fail("no_email");

    const email = gUser.email.toLowerCase().trim();
    const name  = (gUser.name as string) || email.split("@")[0];

    /* ── 3. DB'de bul veya oluştur ───────────────────────────── */
    let dbUser = await queryOne<{ id: number }>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (!dbUser) {
      // Google ile ilk kez giriş — şifresiz hesap (random hash)
      const randomHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      const result = await execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, randomHash]
      );
      dbUser = { id: result.insertId };
    }

    /* ── 4. Session oluştur ───────────────────────────────────── */
    const headers = new Headers();
    await createSession(
      dbUser.id,
      headers,
      req.headers.get("x-forwarded-for") || undefined,
      req.headers.get("user-agent") || undefined
    );

    // State cookie'yi temizle + /hesap'a yönlendir
    headers.append(
      "Set-Cookie",
      "google_oauth_state=; Path=/; HttpOnly; Max-Age=0"
    );
    headers.set("Location", `${origin}/hesap`);

    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.error("[Google OAuth callback]", err);
    return fail("server_error");
  }
}
