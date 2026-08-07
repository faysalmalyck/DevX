import { createHash, createHmac } from "node:crypto";

import { prisma } from "@/lib/db/prisma";

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

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
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
): RateLimitResult {
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

// ──────────────────────────────────────────────
// Public job application limiter
// ──────────────────────────────────────────────

const APPLICATION_RATE_LIMIT_MAX_ATTEMPTS = 5;
const APPLICATION_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const APPLICATION_RATE_LIMIT_RETRY_ATTEMPTS = 4;
const APPLICATION_RATE_LIMIT_RETENTION_MS = 48 * 60 * 60 * 1000;

function applicationRateLimitKey(ip: string): string {
  // Do not persist a raw visitor IP address in the rate-limit table.
  const normalizedIp = ip.trim().slice(0, 256);
  const ipHash = process.env.JWT_SECRET
    ? createHmac("sha256", process.env.JWT_SECRET)
        .update(normalizedIp)
        .digest("hex")
    : createHash("sha256").update(normalizedIp).digest("hex");

  return `application:${ipHash}`;
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === "P2002"
  );
}

/**
 * Distributed, database-backed limiter for the public application endpoint.
 * It uses optimistic conditional updates so concurrent Vercel instances cannot
 * admit more than the configured number of submissions in a time window.
 */
export async function checkApplicationRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const key = applicationRateLimitKey(ip);
  const now = new Date();

  for (let attempt = 0; attempt < APPLICATION_RATE_LIMIT_RETRY_ATTEMPTS; attempt += 1) {
    const existingLimit = await prisma.applicationRateLimit.findUnique({
      where: { key },
      select: {
        count: true,
        windowStartedAt: true,
      },
    });

    if (!existingLimit) {
      try {
        await prisma.applicationRateLimit.create({
          data: {
            key,
            count: 1,
            windowStartedAt: now,
          },
        });

        return {
          allowed: true,
          remaining: APPLICATION_RATE_LIMIT_MAX_ATTEMPTS - 1,
          retryAfterMs: 0,
        };
      } catch (error) {
        if (isPrismaUniqueConstraintError(error)) continue;
        throw error;
      }
    }

    const windowExpiresAt = new Date(
      existingLimit.windowStartedAt.getTime() + APPLICATION_RATE_LIMIT_WINDOW_MS
    );

    if (windowExpiresAt <= now) {
      const resetWindow = await prisma.applicationRateLimit.updateMany({
        where: {
          key,
          windowStartedAt: existingLimit.windowStartedAt,
        },
        data: {
          count: 1,
          windowStartedAt: now,
        },
      });

      if (resetWindow.count === 1) {
        return {
          allowed: true,
          remaining: APPLICATION_RATE_LIMIT_MAX_ATTEMPTS - 1,
          retryAfterMs: 0,
        };
      }

      continue;
    }

    if (existingLimit.count >= APPLICATION_RATE_LIMIT_MAX_ATTEMPTS) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(windowExpiresAt.getTime() - now.getTime(), 1_000),
      };
    }

    const incremented = await prisma.applicationRateLimit.updateMany({
      where: {
        key,
        count: existingLimit.count,
        windowStartedAt: existingLimit.windowStartedAt,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    if (incremented.count === 1) {
      return {
        allowed: true,
        remaining: Math.max(
          APPLICATION_RATE_LIMIT_MAX_ATTEMPTS - existingLimit.count - 1,
          0
        ),
        retryAfterMs: 0,
      };
    }
  }

  // Under extreme contention, fail closed briefly rather than allowing a burst.
  return {
    allowed: false,
    remaining: 0,
    retryAfterMs: 1_000,
  };
}

export async function pruneApplicationRateLimits(): Promise<number> {
  const expiredBefore = new Date(
    Date.now() - APPLICATION_RATE_LIMIT_RETENTION_MS
  );
  const result = await prisma.applicationRateLimit.deleteMany({
    where: {
      windowStartedAt: { lt: expiredBefore },
    },
  });

  return result.count;
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string {
  // Vercel supplies this trusted forwarding header at the edge. Prefer it to
  // generic client-controlled forwarding headers when it is available.
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "127.0.0.1";
}
