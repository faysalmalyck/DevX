import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { getActiveSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/auth/rate-limit";

export async function PATCH(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, avatar } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        avatar: avatar || null,
      },
    });

    await prisma.userActivity.create({
      data: {
        userId: session.id,
        action: "UPDATE_PROFILE",
        module: "Account",
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        username: updated.username,
        phone: updated.phone,
        avatar: updated.avatar,
        role: updated.role,
        userType: "user",
      },
    });
  } catch (error) {
    console.error("User profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
    }

    const { verifyPassword, hashPassword } = await import("@/lib/auth/hash");

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { password: await hashPassword(newPassword) },
    });

    // Revoke all sessions except current
    await prisma.userSession.deleteMany({
      where: {
        userId: session.id,
        id: { not: session.sessionId },
      },
    });

    await prisma.userActivity.create({
      data: {
        userId: session.id,
        action: "CHANGE_PASSWORD",
        module: "Security",
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed. Other sessions have been revoked.",
    });
  } catch (error) {
    console.error("User password change error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
