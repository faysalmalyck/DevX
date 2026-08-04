import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.userType === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { id: session.id, deletedAt: null },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!admin || admin.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "Account suspended or not found" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          firstName: admin.firstName,
          lastName: admin.lastName,
          avatar: admin.avatar,
          phone: admin.phone,
          designation: admin.designation,
          department: admin.department,
          bio: admin.bio,
          role: admin.role.name,
          status: admin.status,
          twoFactorEnabled: admin.twoFactorEnabled,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
          userType: "admin",
          permissions: admin.role.permissions.map(
  (rp: any) => `${rp.permission.module}:${rp.permission.action}`
),
          isCeo: admin.id === "ceo-faysal-mushtaq" || admin.role.isSuperAdmin,
        },
      });
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.id, deletedAt: null },
      });

      if (!user || user.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "Account suspended or not found" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          phone: user.phone,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          userType: "user",
        },
      });
    }
  } catch (error) {
    console.error("Get current user profile error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while retrieving user details" },
      { status: 500 }
    );
  }
}
