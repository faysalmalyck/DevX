import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type TokenType = "access" | "refresh";
export type UserType = "admin" | "user";

/**
 * Raised for server configuration problems that must not be treated like an
 * expired browser session. Callers can return a 500 and preserve cookies so a
 * transient deployment problem does not sign a user out.
 */
export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export interface AuthTokenPayload extends JWTPayload {
  sub: string;        // userId or adminId
  email: string;
  role: string;       // role name (e.g. "CEO", "Administrator", "Client")
  userType: UserType; // "admin" | "user"
  type: TokenType;    // "access" | "refresh"
  sessionId: string;  // DB session record ID
}

// ──────────────────────────────────────────────
// Secrets
// ──────────────────────────────────────────────

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthConfigurationError("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

// ──────────────────────────────────────────────
// Expiry durations
// ──────────────────────────────────────────────

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REMEMBER_ME_REFRESH_EXPIRY = "30d";

// ──────────────────────────────────────────────
// Token creation
// ──────────────────────────────────────────────

export async function createAccessToken(payload: {
  sub: string;
  email: string;
  role: string;
  userType: UserType;
  sessionId: string;
}): Promise<string> {
  return new SignJWT({
    ...payload,
    type: "access" as TokenType,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuer("DevX-auth")
    .setAudience("DevX-app")
    .sign(getSecret());
}

export async function createRefreshToken(payload: {
  sub: string;
  email: string;
  role: string;
  userType: UserType;
  sessionId: string;
  rememberMe?: boolean;
}): Promise<string> {
  const { rememberMe, ...tokenPayload } = payload;

  return new SignJWT({
    ...tokenPayload,
    type: "refresh" as TokenType,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      rememberMe ? REMEMBER_ME_REFRESH_EXPIRY : REFRESH_TOKEN_EXPIRY
    )
    .setIssuer("DevX-auth")
    .setAudience("DevX-app")
    .sign(getSecret());
}

// ──────────────────────────────────────────────
// Token verification
// ──────────────────────────────────────────────

export async function verifyToken(
  token: string,
  expectedType?: TokenType
): Promise<AuthTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "DevX-auth",
      audience: "DevX-app",
    });

    const authPayload = payload as AuthTokenPayload;

    if (expectedType && authPayload.type !== expectedType) {
      throw new Error(`Expected ${expectedType} token, got ${authPayload.type}`);
    }

    return authPayload;
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      throw error;
    }

    throw new Error(
      `Token verification failed: ${error instanceof Error ? error.message : "Invalid token"}`
    );
  }
}

// ──────────────────────────────────────────────
// Token pair creation helper
// ──────────────────────────────────────────────

export async function createTokenPair(payload: {
  sub: string;
  email: string;
  role: string;
  userType: UserType;
  sessionId: string;
  rememberMe?: boolean;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(payload),
    createRefreshToken(payload),
  ]);

  return { accessToken, refreshToken };
}

// ──────────────────────────────────────────────
// Expiry helpers (for DB session records)
// ──────────────────────────────────────────────

export function getRefreshExpiry(rememberMe = false): Date {
  const ms = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

export function getAccessExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000);
}
