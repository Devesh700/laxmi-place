import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "lcp_admin_session";

async function verifySessionEdge(cookieValue: string | undefined, secret: string): Promise<boolean> {
  if (!cookieValue || !secret) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [expiresStr, nonce, sigHex] = parts;
  if (!expiresStr || !nonce || !sigHex) return false;

  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${expiresStr}.${nonce}`));
  const expectedHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expectedHex.length !== sigHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ sigHex.charCodeAt(i);
  }
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_DEV_TOKEN;
  if (!secret || secret.length < 12) {
    console.log("Redirecting to not found", secret);
    return new NextResponse("Not Found", { status: 404 });
  }

  if (pathname === "/admin/login") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const cookieVal = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionEdge(cookieVal, secret);

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
