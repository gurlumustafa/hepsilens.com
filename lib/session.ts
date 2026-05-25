import { cookies } from "next/headers";
import { queryOne, execute } from "@/lib/db";
import crypto from "crypto";

const COOKIE_NAME = "hl_session";
const SESSION_DURATION_DAYS = 30;

export interface SessionUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_anonymous: number;
  notif_email: number;
  notif_sms: number;
  member_since: string;
}

/** Cookie'den oturumu doğrula, kullanıcıyı döndür */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const user = await queryOne<SessionUser>(
    `SELECT u.id, u.name, u.email, u.phone, u.is_anonymous,
            u.notif_email, u.notif_sms, u.member_since
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.session_token = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  );

  if (user) {
    // son aktivite güncelle (fire-and-forget)
    execute("UPDATE sessions SET last_activity = NOW() WHERE session_token = ?", [token]).catch(() => {});
  }

  return user;
}

/** Yeni session oluştur, HTTP-only cookie set et */
export async function createSession(
  userId: number,
  responseHeaders: Headers,
  ip?: string,
  userAgent?: string
): Promise<void> {
  const token = crypto.randomBytes(48).toString("hex");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  await execute(
    `INSERT INTO sessions (session_token, user_id, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [token, userId, ip ?? null, userAgent ?? null, expires.toISOString().slice(0, 19).replace("T", " ")]
  );

  // Güvenli HTTP-only cookie
  responseHeaders.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_DAYS * 86400}`
  );
}

/** Session'ı sil (çıkış) */
export async function destroySession(responseHeaders: Headers): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await execute("DELETE FROM sessions WHERE session_token = ?", [token]).catch(() => {});
  }
  responseHeaders.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
