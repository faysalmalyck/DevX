import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyToken, createTokenPair } from "@/lib/auth/jwt";
import { getAuthCookies, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  try {
    const { refreshToken } = await getAuthCookies();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token missing" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = await verifyToken(refreshToken, "refresh");

    // Verify session in database
    let sessionExists = false;
    if (payload.userType === "admin") {
      const session = await prisma.adminSession.findUnique({
        where: { id: payload.sessionId },
      });
      sessionExists = !!session && session.expiresAt > new Date();
    } else {
      const session = await prisma.userSession.findUnique({
        where: { id: payload.sessionId },
      });
      sessionExists = !!session && session.expiresAt > new Date();
    }

    if (!sessionExists) {
      await clearAuthCookies();
      return NextResponse.json(
        { error: "Session has expired or is invalid" },
        { status: 401 }
      );
    }

    // Rotate token pair
    const tokens = await createTokenPair({
      sub: payload.sub!,
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
      sessionId: payload.sessionId,
    });

    // Update session expiration in database (slide window)
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // extend by 7 days
    if (payload.userType === "admin") {
      await prisma.adminSession.update({
        where: { id: payload.sessionId },
        data: { expiresAt: newExpiresAt },
      });
    } else {
      await prisma.userSession.update({
        where: { id: payload.sessionId },
        data: { expiresAt: newExpiresAt },
      });
    }

    // Set updated cookies
    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return NextResponse.json({
      success: true,
      user: {
        email: payload.email,
        role: payload.role,
        userType: payload.userType,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    await clearAuthCookies();
    return NextResponse.json(
      { error: "Session invalid or expired" },
      { status: 401 }
    );
  }
}
