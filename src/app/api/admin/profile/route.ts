import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { getActiveSession } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/lib/auth/validation";
import { getClientIp } from "@/lib/auth/rate-limit";

export async function PATCH(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await getActiveSession();

    if (!session || session.userType !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Operator login required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const updateData = result.data;

    // Check email uniqueness if email is changed
    if (updateData.email) {
      const emailMatch = await prisma.admin.findFirst({
        where: {
          email: updateData.email,
          id: { not: session.id },
          deletedAt: null,
        },
      });

      if (emailMatch) {
        return NextResponse.json(
          { error: "This email address is already in use by another operator" },
          { status: 409 }
        );
      }
    }

    // Check username uniqueness if changed
    if (updateData.username) {
      // @ts-ignore (we know username exists in prisma, let's keep it safe)
      const usernameMatch = await prisma.admin.findFirst({
        where: {
          username: updateData.username,
          id: { not: session.id },
          deletedAt: null,
        },
      });

      if (usernameMatch) {
        return NextResponse.json(
          { error: "This username is already in use by another operator" },
          { status: 409 }
        );
      }
    }

    // Perform database update
    const updatedAdmin = await prisma.admin.update({
      where: { id: session.id },
      data: {
        ...updateData,
        avatar: body.avatar !== undefined ? body.avatar : undefined, // allow avatar updating
      },
      include: { role: true },
    });

    // Logging Activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.id,
        action: "UPDATE_PROFILE",
        module: "Security",
        description: `Profile parameters updated from ${ip}`,
        ipAddress: ip,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "ADMIN_PROFILE_UPDATED",
        entity: "Admin",
        entityId: session.id,
        metadata: { ip, fieldsChanged: Object.keys(updateData) },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        username: updatedAdmin.username,
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
        avatar: updatedAdmin.avatar,
        phone: updatedAdmin.phone,
        designation: updatedAdmin.designation,
        department: updatedAdmin.department,
        bio: updatedAdmin.bio,
        role: updatedAdmin.role.name,
        timezone: updatedAdmin.timezone,
        language: updatedAdmin.language,
        userType: "admin",
      },
    });
  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating profile" },
      { status: 500 }
    );
  }
}
