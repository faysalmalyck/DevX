import { cookies } from "next/headers";
import type { TokenType } from "./jwt";

// ──────────────────────────────────────────────
// Cookie names
// ──────────────────────────────────────────────

const ACCESS_TOKEN_COOKIE = "DevX-access-token";
const REFRESH_TOKEN_COOKIE = "DevX-refresh-token";
const CSRF_TOKEN_COOKIE = "DevX-csrf-token";

// ──────────────────────────────────────────────
// Cookie options
// ──────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === "production";

function getCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

// ──────────────────────────────────────────────
// Set auth cookies (server action / route handler)
// ──────────────────────────────────────────────

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe = false
) {
  const cookieStore = await cookies();

  // Access token: 15 minutes
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(15 * 60));

  // Refresh token: 7 days or 30 days with remember me
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    getCookieOptions(refreshMaxAge)
  );
}

// ──────────────────────────────────────────────
// Clear auth cookies
// ──────────────────────────────────────────────

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// ──────────────────────────────────────────────
// Read auth cookies
// ──────────────────────────────────────────────

export async function getAuthCookies(): Promise<{
  accessToken: string | undefined;
  refreshToken: string | undefined;
}> {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value,
    refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE)?.value,
  };
}

/**
 * Read a specific auth token from cookies.
 */
export async function getTokenCookie(
  type: TokenType
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const name =
    type === "access" ? ACCESS_TOKEN_COOKIE : REFRESH_TOKEN_COOKIE;
  return cookieStore.get(name)?.value;
}

// ──────────────────────────────────────────────
// CSRF cookie (readable by JS for double-submit)
// ──────────────────────────────────────────────

export async function setCsrfCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Must be readable by client JS
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export async function getCsrfCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_COOKIE)?.value;
}

// Export cookie names for middleware (which can't use next/headers)
export const COOKIE_NAMES = {
  ACCESS_TOKEN: ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN: REFRESH_TOKEN_COOKIE,
  CSRF_TOKEN: CSRF_TOKEN_COOKIE,
} as const;
