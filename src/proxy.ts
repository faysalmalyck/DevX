
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

// ──────────────────────────────────────────────
// Route definitions
// ──────────────────────────────────────────────

const ADMIN_ROUTES = ["/admin"];
const USER_ROUTES = ["/account"];
const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password", "/register"];
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/team",
  "/contact",
  "/careers",
  "/core-values",
  "/signup",
];

// ──────────────────────────────────────────────
// JWT verification in middleware (Edge-compatible)
// ──────────────────────────────────────────────

async function verifyAccessToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      issuer: "DevX-auth",
      audience: "DevX-app",
    });
    return payload as {
      sub: string;
      email: string;
      role: string;
      userType: "admin" | "user";
      type: "access" | "refresh";
      sessionId: string;
    };
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Route matching
// ──────────────────────────────────────────────

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// ──────────────────────────────────────────────
// proxy
// ──────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static assets, api routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files (.css, .js, .png, etc.)
  ) {
    return NextResponse.next();
  }

  // Read access token from cookie
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  let user: Awaited<ReturnType<typeof verifyAccessToken>> = null;

  if (accessToken) {
    user = await verifyAccessToken(accessToken);
  }

  // ── Protected admin routes ──────────────────
  if (matchesRoute(pathname, ADMIN_ROUTES)) {
    if (!user || user.userType !== "admin") {
      // If they have a refresh token, let them try the page
      // (the page/API will handle the refresh)
      if (refreshToken && !user) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("portal", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protected user routes ──────────────────
  if (matchesRoute(pathname, USER_ROUTES)) {
    if (!user || user.userType !== "user") {
      if (refreshToken && !user) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect authenticated users away from auth pages ──
  if (matchesRoute(pathname, AUTH_ROUTES) && user) {
    if (user.userType === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

// ──────────────────────────────────────────────
// Matcher — tells Next.js which routes to intercept
// ──────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
