import { execute, queryOne } from "./db";

const EXPIRY_MINUTES = 10;

export async function storeOAuthState(state: string): Promise<void> {
  const expires = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
  const expiresStr = expires.toISOString().slice(0, 19).replace("T", " ");
  // Arka planda süresi dolmuş state'leri temizle
  execute("DELETE FROM oauth_states WHERE expires_at < NOW()").catch(() => {});
  await execute(
    "INSERT INTO oauth_states (state, expires_at) VALUES (?, ?)",
    [state, expiresStr]
  );
}

export async function consumeOAuthState(state: string): Promise<boolean> {
  const row = await queryOne<{ state: string }>(
    "SELECT state FROM oauth_states WHERE state = ? AND expires_at > NOW()",
    [state]
  );
  if (!row) return false;
  await execute("DELETE FROM oauth_states WHERE state = ?", [state]);
  return true;
}
