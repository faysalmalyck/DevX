import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { hashPassword } from "@/lib/auth/hash";
import { getActiveSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/auth/rate-limit";
import { z } from "zod";

const adminRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const result = adminRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, username, password, phone, designation, department } = result.data;

    // Check if any admin exists in the database
    const adminCount = await prisma.admin.count();

    if (adminCount > 0) {
      // If admins exist, only a Super Admin (CEO / isSuperAdmin) can register new ones
      const session = await getActiveSession();
      if (!session || session.userType !== "admin") {
        return NextResponse.json(
          { error: "Access denied. Only authenticated administrators can register new accounts." },
          { status: 401 }
        );
      }

      const activeAdmin = await prisma.admin.findUnique({
        where: { id: session.id },
        include: { role: true },
      });

      if (!activeAdmin || !activeAdmin.role.isSuperAdmin) {
        return NextResponse.json(
          { error: "Forbidden. Only Super Administrators can register new operators." },
          { status: 403 }
        );
      }
    }

    // Check if email or username is already in use
    const duplicateEmail = await prisma.admin.findFirst({
      where: { email },
    });
    if (duplicateEmail) {
      return NextResponse.json(
        { error: "An administrator account with this email address already exists" },
        { status: 409 }
      );
    }

    const duplicateUsername = await prisma.admin.findFirst({
      where: { username },
    });
    if (duplicateUsername) {
      return NextResponse.json(
        { error: "This username is already in use" },
        { status: 409 }
      );
    }

    // Determine target role (First admin becomes CEO, others default to Administrator)
    const targetRoleName = adminCount === 0 ? "CEO" : "Administrator";
    let role = await prisma.role.findUnique({
      where: { name: targetRoleName },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: targetRoleName,
          slug: targetRoleName.toLowerCase(),
          description: targetRoleName === "CEO" ? "CEO & Founder - Super Admin" : "Standard Administrator",
          isSuperAdmin: targetRoleName === "CEO",
          isSystem: true,
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        phone: phone || null,
        designation: designation || null,
        department: department || null,
        roleId: role.id,
        status: "ACTIVE",
        requirePasswordChange: adminCount > 0, // Force change password for admins added by others
      },
    });

    // Log the registration event in audit logs
    const session = await getActiveSession();
    const actorId = session?.id || newAdmin.id; // self if bootstrap
    const actorName = session ? `${session.firstName} ${session.lastName}` : "System Bootstrap";

    await prisma.adminActivity.create({
      data: {
        adminId: newAdmin.id,
        action: "REGISTER",
        module: "Administrators",
        description: `Administrator account created by ${actorName}`,
        ipAddress: ip,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "ADMIN_REGISTER_SUCCESS",
        entity: "Admin",
        entityId: newAdmin.id,
        metadata: { ip, createdAdminId: newAdmin.id, role: role.name },
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        username: newAdmin.username,
        role: role.name,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during administrator registration" },
      { status: 500 }
    );
  }
}
