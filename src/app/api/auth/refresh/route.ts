import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  AuthConfigurationError,
  verifyToken,
  createTokenPair,
  type AuthTokenPayload,
} from "@/lib/auth/jwt";
import { getAuthCookies, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

function unauthenticatedResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function POST() {
  const { refreshToken } = await getAuthCookies();

  if (!refreshToken) {
    return unauthenticatedResponse("Refresh token missing");
  }

  let payload: AuthTokenPayload;
  try {
    payload = await verifyToken(refreshToken, "refresh");
  } catch (error) {
    if (error instanceof AuthConfigurationError) {
      console.error("Token refresh configuration error:", error);
      return NextResponse.json(
        { error: "Authentication service is temporarily unavailable" },
        { status: 500 }
      );
    }

    await clearAuthCookies();
    return unauthenticatedResponse("Session invalid or expired");
  }

  try {
    // Verify that the token's session belongs to its subject and that the
    // account is still active. A session ID alone must never be enough to
    // refresh a suspended, deleted, or different account's credentials.
    let refreshedUser: { email: string; role: string } | null = null;
    if (payload.userType === "admin") {
      const session = await prisma.adminSession.findFirst({
        where: {
          id: payload.sessionId,
          adminId: payload.sub!,
          expiresAt: { gt: new Date() },
          admin: { deletedAt: null, status: "ACTIVE" },
        },
        select: {
          admin: {
            select: {
              email: true,
              role: { select: { name: true } },
            },
          },
        },
      });
      refreshedUser = session
        ? { email: session.admin.email, role: session.admin.role.name }
        : null;
    } else {
      const session = await prisma.userSession.findFirst({
        where: {
          id: payload.sessionId,
          userId: payload.sub!,
          expiresAt: { gt: new Date() },
          user: { deletedAt: null, status: "ACTIVE" },
        },
        select: {
          user: { select: { email: true, role: true } },
        },
      });
      refreshedUser = session
        ? { email: session.user.email, role: session.user.role }
        : null;
    }

    if (!refreshedUser) {
      await clearAuthCookies();
      return unauthenticatedResponse("Session has expired or is invalid");
    }

    // Update session expiration in database (slide window)
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // extend by 7 days
    let sessionExtended = false;
    if (payload.userType === "admin") {
      const result = await prisma.adminSession.updateMany({
        where: {
          id: payload.sessionId,
          adminId: payload.sub!,
          expiresAt: { gt: new Date() },
          admin: { deletedAt: null, status: "ACTIVE" },
        },
        data: { expiresAt: newExpiresAt },
      });
      sessionExtended = result.count === 1;
    } else {
      const result = await prisma.userSession.updateMany({
        where: {
          id: payload.sessionId,
          userId: payload.sub!,
          expiresAt: { gt: new Date() },
          user: { deletedAt: null, status: "ACTIVE" },
        },
        data: { expiresAt: newExpiresAt },
      });
      sessionExtended = result.count === 1;
    }
    if (!sessionExtended) {
      await clearAuthCookies();
      return unauthenticatedResponse("Session has expired or is invalid");
    }

    // Generate new claims only after the owned, active session has been
    // extended successfully.
    const tokens = await createTokenPair({
      sub: payload.sub!,
      email: refreshedUser.email,
      role: refreshedUser.role,
      userType: payload.userType,
      sessionId: payload.sessionId,
    });

    // Set updated cookies
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return NextResponse.json({
      success: true,
      user: {
        email: refreshedUser.email,
        role: refreshedUser.role,
        userType: payload.userType,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Authentication service is temporarily unavailable" },
      { status: 500 }
    );
  }
}
