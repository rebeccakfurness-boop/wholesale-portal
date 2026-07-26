import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { createAdminToken, verifyAdminToken } from "@/lib/admin/token";

function adminSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set — see .env.example");
  return secret;
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const secret = adminSecret();
  // Same-length comparison via a fixed-size digest avoids leaking the real
  // password's length through a naive string comparison.
  const [a, b] = await Promise.all([sha256(candidate), sha256(secret)]);
  return a === b;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSession() {
  const token = await createAdminToken(adminSecret());
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_SESSION_COOKIE)?.value, adminSecret());
}
