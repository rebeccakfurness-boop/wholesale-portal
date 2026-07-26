import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_COOKIE } from "@/lib/constants";
import { verifyAdminToken } from "@/lib/admin/token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isAdminLogin = pathname.startsWith("/admin/login");
    const adminSecret = process.env.ADMIN_PASSWORD;
    const hasAdminSession =
      Boolean(adminSecret) &&
      (await verifyAdminToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value, adminSecret!));

    if (!hasAdminSession && !isAdminLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (hasAdminSession && isAdminLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const isPublic = pathname.startsWith("/login");
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets (anything in public/, e.g. /brand/*.png) in addition to
  // Next internals — Next's image optimizer does an internal self-fetch for
  // local images that doesn't carry the session cookie, so gating those paths
  // made every optimized <Image> 404 through a login redirect.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
