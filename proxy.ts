import { NextResponse, type NextRequest } from "next/server";

// Optimistic, cookie-only auth checks (Next 16 "Proxy", formerly Middleware).
// Secure verification still happens in the DAL (requireUser) close to the data.
const PROTECTED = ["/dashboard"];
const AUTH_PAGES = ["/login", "/register"];

function hasSessionCookie(req: NextRequest) {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token")
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = hasSessionCookie(req);

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !authed) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && authed) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
