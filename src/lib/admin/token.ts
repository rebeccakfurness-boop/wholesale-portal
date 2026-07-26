// Signing helpers for the admin session cookie. Uses Web Crypto (available in
// both the Node and Edge runtimes) so this module can be imported from
// proxy.ts without pulling in any Node-only APIs.

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createAdminToken(secret: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(expiresAt)));
  return `${expiresAt}.${toHex(signature)}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiresAtStr, signatureHex] = token.split(".");
  if (!expiresAtStr || !signatureHex) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const key = await hmacKey(secret);
  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(expiresAtStr)
  );
  return constantTimeEqual(toHex(expectedSignature), signatureHex);
}
