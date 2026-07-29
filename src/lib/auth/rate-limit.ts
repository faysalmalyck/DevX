// ──────────────────────────────────────────────
// In-memory rate limiter (Token Bucket algorithm)
// ──────────────────────────────────────────────

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxTokens: number;      // Max requests allowed
  refillRate: number;     // Tokens restored per interval
  refillIntervalMs: number; // Refill interval in ms
}

const buckets = new Map<string, RateLimitEntry>();

// Clean up stale entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const staleThreshold = now - 60 * 60 * 1000; // 1 hour

  for (const [key, entry] of buckets) {
    if (entry.lastRefill < staleThreshold) {
      buckets.delete(key);
    }
  }
}

// ──────────────────────────────────────────────
// Rate limiter
// ──────────────────────────────────────────────

function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  cleanup();

  const now = Date.now();
  let entry = buckets.get(key);

  if (!entry) {
    entry = { tokens: config.maxTokens, lastRefill: now };
    buckets.set(key, entry);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refills = Math.floor(elapsed / config.refillIntervalMs);
  if (refills > 0) {
    entry.tokens = Math.min(
      config.maxTokens,
      entry.tokens + refills * config.refillRate
    );
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return {
      allowed: true,
      remaining: entry.tokens,
      retryAfterMs: 0,
    };
  }

  // Rate limited
  const retryAfterMs = config.refillIntervalMs - (now - entry.lastRefill);
  return {
    allowed: false,
    remaining: 0,
    retryAfterMs: Math.max(retryAfterMs, 1000),
  };
}

// ──────────────────────────────────────────────
// Preset rate limiters for auth endpoints
// ──────────────────────────────────────────────

/**
 * Login rate limiter: 5 attempts per 15 minutes per IP.
 */
export function checkLoginRateLimit(ip: string) {
  return checkRateLimit(`login:${ip}`, {
    maxTokens: 5,
    refillRate: 1,
    refillIntervalMs: 3 * 60 * 1000, // 1 token per 3 minutes
  });
}

/**
 * Registration rate limiter: 3 attempts per hour per IP.
 */
export function checkRegistrationRateLimit(ip: string) {
  return checkRateLimit(`register:${ip}`, {
    maxTokens: 3,
    refillRate: 1,
    refillIntervalMs: 20 * 60 * 1000, // 1 token per 20 minutes
  });
}

/**
 * Password reset rate limiter: 3 attempts per hour per IP.
 */
export function checkPasswordResetRateLimit(ip: string) {
  return checkRateLimit(`reset:${ip}`, {
    maxTokens: 3,
    refillRate: 1,
    refillIntervalMs: 20 * 60 * 1000, // 1 token per 20 minutes
  });
}

/**
 * General API rate limiter: 60 requests per minute per IP.
 */
export function checkApiRateLimit(ip: string) {
  return checkRateLimit(`api:${ip}`, {
    maxTokens: 60,
    refillRate: 10,
    refillIntervalMs: 10 * 1000, // 10 tokens per 10 seconds
  });
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "127.0.0.1";
}
