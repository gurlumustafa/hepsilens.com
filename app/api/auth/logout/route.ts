import { destroySession } from "@/lib/session";

export async function POST() {
  const headers = new Headers();
  await destroySession(headers);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
