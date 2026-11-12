import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "lcp_admin_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

// Basic in-memory rate limiting per IP for v1 (documented in DECISIONS.md)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

export function isAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_DEV_TOKEN && process.env.ADMIN_DEV_TOKEN.length >= 12);
}

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

export function verifyDevToken(candidate: string): boolean {
  const expected = process.env.ADMIN_DEV_TOKEN;
  if (!expected || !candidate) return false;
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionCookieValue(): string {
  const secret = process.env.ADMIN_DEV_TOKEN;
  if (!secret) throw new Error("ADMIN_DEV_TOKEN is not configured");
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const sig = signPayload(payload, secret);
  return `${payload}.${sig}`;
}

export function verifySessionCookieValue(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_DEV_TOKEN;
  if (!secret || !cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [expiresStr, nonce, sig] = parts;
  if (!expiresStr || !nonce || !sig) return false;

  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expectedSig = signPayload(`${expiresStr}.${nonce}`, secret);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  const value = createSessionCookieValue();
  cookieStore.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: ADMIN_COOKIE_NAME,
    path: "/admin",
  });
}

export async function requireAdminSession(): Promise<boolean> {
  if (!isAdminEnabled()) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionCookieValue(token);
}
