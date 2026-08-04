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
    const { token, hashedToken } = generateSecureToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token in DB
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiry,
        },
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

    // Simulate sending email (print to console in development)
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

    console.log(`[MAILER] Password reset requested for: ${email}`);
    console.log(`[MAILER] Reset Link: ${resetUrl}`);

    return successResponse;
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request" },
      { status: 500 }
    );
  }
}
