import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { hashToken } from "@/lib/auth/csrf";
import { destroyAllSessions } from "@/lib/auth/session";
import { getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Token, password, and confirm password are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const hashedToken = hashToken(token);

    // Look up Admin
    const admin = await prisma.admin.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
      },
    });

    // Look up User
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
        deletedAt: null,
      },
    });

    if (!admin && !user) {
      return NextResponse.json(
        { error: "The password reset token is invalid or has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    if (admin) {
      // Update admin
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          failedLoginAttempts: 0,
          lockedUntil: null,
          status: admin.status === "INVITED" ? "ACTIVE" : admin.status,
          requirePasswordChange: false,
        },
        select: { id: true },
      });

      // Revoke all active sessions for security
      await destroyAllSessions(admin.id, "admin");

      // Audit logs
      await prisma.adminActivity.create({
        data: {
          adminId: admin.id,
          action: "PASSWORD_RESET",
          module: "Security",
          description: `Password reset successfully via secure token from ${ip}`,
          ipAddress: ip,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: admin.id,
          action: "PASSWORD_RESET_SUCCESS",
          entity: "Admin",
          entityId: admin.id,
          metadata: { ip },
        },
      });
    } else if (user) {
      // Update user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          passwordChangedAt: new Date(),
        },
      });

      // Revoke all active sessions for security
      await destroyAllSessions(user.id, "user");

      // Audit logs
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET",
          module: "Security",
          ipAddress: ip,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "PASSWORD_RESET_SUCCESS",
          entity: "User",
          entityId: user.id,
          metadata: { ip },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
