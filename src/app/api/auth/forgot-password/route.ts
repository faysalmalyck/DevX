import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateSecureToken } from "@/lib/auth/csrf";
import { checkPasswordResetRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkPasswordResetRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many password reset requests. Please try again in ${Math.ceil(rateLimit.retryAfterMs / 60000)} minute(s).` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Lookup in both tables
    const admin = await prisma.admin.findUnique({
      where: { email, deletedAt: null },
      select: { id: true },
    });

    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    // To avoid user enumeration attacks, always respond with a success status
    // and a generic message, even if the user/admin doesn't exist.
    const successResponse = NextResponse.json({
      success: true,
      message: "If an account exists with that email address, a password reset link has been sent.",
    });

    if (!admin && !user) {
      return successResponse;
    }

    // Generate secure token & hash
    const { hashedToken } = generateSecureToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token in DB
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiry,
        },
        select: { id: true },
      });
    } else if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiry,
        },
      });
    }

    // Log request
    await prisma.auditLog.create({
      data: {
        actorId: admin?.id || user?.id,
        action: "PASSWORD_RESET_REQUESTED",
        entity: admin ? "Admin" : "User",
        entityId: admin?.id || user?.id || "unknown",
        metadata: { ip, email },
      },
    });

    // Never write the raw reset token or a token-bearing URL to application
    // logs, including in development. A configured delivery service must keep
    // the token outside application logging.

    return successResponse;
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request" },
      { status: 500 }
    );
  }
}
