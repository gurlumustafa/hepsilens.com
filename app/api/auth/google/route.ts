import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const state = crypto.randomBytes(16).toString("hex");
  const origin = new URL(req.url).origin;

  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID!,
    redirect_uri:  `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope:         "openid email profile",
    state,
    access_type:   "offline",
    prompt:        "select_account",
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );

  // CSRF koruması için state'i HTTP-only cookie'de sakla (10 dakika)
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge:   600,
    path:     "/",
  });

  return response;
}
