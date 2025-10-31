import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public whitelist - these paths don't require auth
  const PUBLIC_PATHS = ["/", "/login", "/signup", "/api", "/favicon.ico", "/_next", "/public"];

  // allow static files and api and next internals
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check cookie for everything else
  const cookie = request.cookies.get("edu_token")?.value;
  if (!cookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // match everything except public folder - middleware runs for all routes by default, but keep explicit matcher for clarity
  matcher: ["/:path*"],
};
