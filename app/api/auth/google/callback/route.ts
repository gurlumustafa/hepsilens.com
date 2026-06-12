import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/lib/db";
import { createSession } from "@/lib/session";
import { consumeOAuthState } from "@/lib/oauth-state";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = process.env.NODE_ENV === "production"
    ? "https://hepsilens.com"
    : "http://localhost:3000";
  const code       = searchParams.get("code");
  const state      = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/hesap/giris?error=${reason}`);

  // Kullanıcı erişimi reddetti
  if (errorParam || !code) return fail("google_denied");

  // CSRF: state doğrula (sunucu belleğinden)
  if (!state || !consumeOAuthState(state)) return fail("state_mismatch");

  /* ── 1. Code → Access Token ───────────────────────────────── */
  let tokens: Record<string, unknown>;
  try {
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
    tokens = await tokenRes.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth] token fetch failed", err);
    return fail("token_fetch_" + encodeURIComponent(msg.slice(0, 80)));
  }

  if (!tokens.access_token) {
    console.error("[Google OAuth] no access_token", tokens);
    return fail("token_exchange");
  }

  /* ── 2. Kullanıcı bilgisi ─────────────────────────────────── */
  let gUser: Record<string, unknown>;
  try {
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    gUser = await userRes.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth] userinfo fetch failed", err);
    return fail("userinfo_" + encodeURIComponent(msg.slice(0, 80)));
  }

  if (!gUser.email) return fail("no_email");

  const email = (gUser.email as string).toLowerCase().trim();
  const name  = (gUser.name as string) || email.split("@")[0];

  /* ── 3. DB'de bul veya oluştur ───────────────────────────── */
  let dbUser: { id: number } | null;
  try {
    dbUser = await queryOne<{ id: number }>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (!dbUser) {
      const randomHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
      const result = await execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, randomHash]
      );
      dbUser = { id: result.insertId };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth] db error", err);
    return fail("db_" + encodeURIComponent(msg.slice(0, 80)));
  }

  /* ── 4. Session oluştur ───────────────────────────────────── */
  try {
    const headers = new Headers();
    await createSession(
      dbUser.id,
      headers,
      req.headers.get("x-forwarded-for") || undefined,
      req.headers.get("user-agent") || undefined
    );

    headers.set("Location", `${origin}/hesap`);

    return new Response(null, { status: 302, headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth] session error", err);
    return fail("session_" + encodeURIComponent(msg.slice(0, 80)));
  }
}
