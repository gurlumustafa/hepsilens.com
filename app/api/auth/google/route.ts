import { NextResponse } from "next/server";
import crypto from "crypto";
import { storeOAuthState } from "@/lib/oauth-state";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const origin = process.env.NODE_ENV === "production"
    ? "https://hepsilens.com"
    : "http://localhost:3000";

  storeOAuthState(state);

  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID!,
    redirect_uri:  `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope:         "openid email profile",
    state,
    access_type:   "offline",
    prompt:        "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
