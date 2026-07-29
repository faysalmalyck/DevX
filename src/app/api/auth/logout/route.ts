import { NextResponse } from "next/server";
import { getAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    const { accessToken, refreshToken } = await getAuthCookies();
    const token = accessToken || refreshToken;

    if (token) {
      try {
        // Try to decode token to get session info
        const payload = await verifyToken(token);
        if (payload && payload.sessionId && payload.userType) {
          // Delete from database
          await destroySession(payload.sessionId, payload.userType);
        }
      } catch (err) {
        // Token verification failed or session already deleted — proceed to clear cookies
      }
    }
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear the client-side cookies
    await clearAuthCookies();
  }

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
