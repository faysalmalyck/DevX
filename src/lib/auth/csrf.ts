import crypto from "crypto";

// ──────────────────────────────────────────────
// CSRF Token Generation
// ──────────────────────────────────────────────

/**
 * Generate a cryptographically secure CSRF token.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ──────────────────────────────────────────────
// CSRF Validation
// ──────────────────────────────────────────────

/**
 * Validate a CSRF token from a request header against the cookie value.
 * Uses the double-submit cookie pattern:
 * - Server sets a non-httpOnly CSRF cookie
 * - Client reads cookie and sends the value in X-CSRF-Token header
 * - Server compares the cookie and header values
 */
export function validateCsrfToken(
  cookieToken: string | undefined,
  headerToken: string | undefined | null
): boolean {
  if (!cookieToken || !headerToken) return false;

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// ──────────────────────────────────────────────
// Secure random token generation (for reset tokens etc)
// ──────────────────────────────────────────────

/**
 * Generate a secure random token for password resets, email verification, etc.
 * Returns both the raw token (sent to user) and a hashed version (stored in DB).
 */
export function generateSecureToken(): {
  token: string;
  hashedToken: string;
} {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return { token, hashedToken };
}

/**
 * Hash a token for DB lookup comparison.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
