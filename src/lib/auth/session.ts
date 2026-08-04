import { prisma } from "@/lib/db/prisma";
import {
  createTokenPair,
  verifyToken,
  getRefreshExpiry,
  type UserType,
  type AuthTokenPayload,
} from "./jwt";
import { setAuthCookies, clearAuthCookies, getAuthCookies } from "./cookies";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
  role: string;
  userType: UserType;
  sessionId: string;
}

interface CreateSessionInput {
  userId: string;
  email: string;
  role: string;
  userType: UserType;
  rememberMe?: boolean;
  device?: string;
  browser?: string;
  ipAddress?: string;
  location?: string;
}

// ──────────────────────────────────────────────
// Create a new session (login)
// ──────────────────────────────────────────────

export async function createSession(
  input: CreateSessionInput
): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
  const expiresAt = getRefreshExpiry(input.rememberMe);

  // Create DB session record
  let sessionId: string;

  if (input.userType === "admin") {
    const session = await prisma.adminSession.create({
      data: {
        adminId: input.userId,
        device: input.device ?? null,
        browser: input.browser ?? null,
        ipAddress: input.ipAddress ?? null,
        location: input.location ?? null,
        expiresAt,
      },
    });
    sessionId = session.id;
  } else {
    const session = await prisma.userSession.create({
      data: {
        userId: input.userId,
        device: input.device ?? null,
        browser: input.browser ?? null,
        ipAddress: input.ipAddress ?? null,
        location: input.location ?? null,
        expiresAt,
      },
    });
    sessionId = session.id;
  }

  // Create JWT token pair
  const tokens = await createTokenPair({
    sub: input.userId,
    email: input.email,
    role: input.role,
    userType: input.userType,
    sessionId,
    rememberMe: input.rememberMe,
  });

  // Set cookies
  await setAuthCookies(tokens.accessToken, tokens.refreshToken, input.rememberMe);

  return { ...tokens, sessionId };
}

// ──────────────────────────────────────────────
// Get active session from cookies
// ──────────────────────────────────────────────

export async function getActiveSession(): Promise<SessionUser | null> {
  try {
    const { accessToken } = await getAuthCookies();

    if (!accessToken) return null;

    const payload = await verifyToken(accessToken, "access");
    return await fetchSessionUser(payload);
  } catch {
    // Access token expired or invalid — try refresh
    return tryRefreshSession();
  }
}

// ──────────────────────────────────────────────
// Refresh the session (rotate tokens)
// ──────────────────────────────────────────────

async function tryRefreshSession(): Promise<SessionUser | null> {
  try {
    const { refreshToken } = await getAuthCookies();

    if (!refreshToken) return null;

    const payload = await verifyToken(refreshToken, "refresh");

    // Verify session still exists in DB
    const sessionExists = await verifyDbSession(
      payload.sessionId,
      payload.userType
    );

    if (!sessionExists) {
      await clearAuthCookies();
      return null;
    }

    // Rotate tokens
    const tokens = await createTokenPair({
      sub: payload.sub!,
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
      sessionId: payload.sessionId,
    });

    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return fetchSessionUser(payload);
  } catch {
    await clearAuthCookies();
    return null;
  }
}

// ──────────────────────────────────────────────
// Fetch user data for session response
// ──────────────────────────────────────────────

async function fetchSessionUser(
  payload: AuthTokenPayload
): Promise<SessionUser | null> {
  if (payload.userType === "admin") {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub!, deletedAt: null },
      include: { role: true },
    });

    if (!admin || admin.status !== "ACTIVE") return null;

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      username: admin.username,
      avatar: admin.avatar,
      role: admin.role.name,
      userType: "admin",
      sessionId: payload.sessionId,
    };
  } else {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub!, deletedAt: null },
    });

    if (!user || user.status !== "ACTIVE") return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      userType: "user",
      sessionId: payload.sessionId,
    };
  }
}

// ──────────────────────────────────────────────
// Verify session exists in DB
// ──────────────────────────────────────────────

async function verifyDbSession(
  sessionId: string,
  userType: UserType
): Promise<boolean> {
  if (userType === "admin") {
    const session = await prisma.adminSession.findUnique({
      where: { id: sessionId },
    });
    return !!session && session.expiresAt > new Date();
  } else {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    return !!session && session.expiresAt > new Date();
  }
}

// ──────────────────────────────────────────────
// Destroy session (logout)
// ──────────────────────────────────────────────

export async function destroySession(
  sessionId: string,
  userType: UserType
): Promise<void> {
  try {
    if (userType === "admin") {
      await prisma.adminSession.delete({ where: { id: sessionId } });
    } else {
      await prisma.userSession.delete({ where: { id: sessionId } });
    }
  } catch {
    // Session may already be deleted — that's OK
  }

  await clearAuthCookies();
}

// ──────────────────────────────────────────────
// Destroy ALL sessions for a user (logout everywhere)
// ──────────────────────────────────────────────

export async function destroyAllSessions(
  userId: string,
  userType: UserType
): Promise<void> {
  if (userType === "admin") {
    await prisma.adminSession.deleteMany({ where: { adminId: userId } });
  } else {
    await prisma.userSession.deleteMany({ where: { userId } });
  }

  await clearAuthCookies();
}

// ──────────────────────────────────────────────
// Get all active sessions for a user
// ──────────────────────────────────────────────

export async function getActiveSessions(userId: string, userType: UserType) {
  const now = new Date();

  if (userType === "admin") {
    return prisma.adminSession.findMany({
      where: { adminId: userId, expiresAt: { gt: now } },
      orderBy: { loginAt: "desc" },
    });
  } else {
    return prisma.userSession.findMany({
      where: { userId, expiresAt: { gt: now } },
      orderBy: { loginAt: "desc" },
    });
  }
}
