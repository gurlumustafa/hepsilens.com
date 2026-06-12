const states = new Map<string, number>(); // state → expiry ms

export function storeOAuthState(state: string): void {
  const now = Date.now();
  for (const [k, v] of states) if (v < now) states.delete(k);
  states.set(state, now + 10 * 60 * 1000);
}

export function consumeOAuthState(state: string): boolean {
  const expiry = states.get(state);
  if (!expiry || expiry < Date.now()) return false;
  states.delete(state);
  return true;
}
