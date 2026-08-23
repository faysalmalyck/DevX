import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";
import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { changePasswordSchema } from "@/lib/auth/validation";
import { verifyPassword, hashPassword } from "@/lib/auth/hash";
import { getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await getActiveSession();

    if (!session || session.userType !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Operator login required." },
        { status: 401 }
      );
    }

    if (!hasValidAdminCsrf(request)) {
      return NextResponse.json(
        { error: "Invalid request token.", code: "CSRF_INVALID" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Load admin record from DB to verify old password
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator record not found" },
        { status: 404 }
      );
    }

    const isValid = await verifyPassword(currentPassword, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Your current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    // Update password in DB
    await prisma.admin.update({
      where: { id: session.id },
      data: {
        password: hashedNewPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
        requirePasswordChange: false,
      },
    });

    // Revoke all other active sessions for security (except this one)
    await prisma.adminSession.deleteMany({
      where: {
        adminId: session.id,
        id: { not: session.sessionId },
      },
    });

    // Logging Activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.id,
        action: "CHANGE_PASSWORD",
        module: "Security",
        description: `Security credentials updated successfully. Other operator sessions revoked.`,
        ipAddress: ip,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "ADMIN_PASSWORD_CHANGED",
        entity: "Admin",
        entityId: session.id,
        metadata: { ip },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully. Other active sessions have been revoked.",
    });
  } catch (error) {
    console.error("Admin change password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while changing password" },
      { status: 500 }
    );
  }
}
