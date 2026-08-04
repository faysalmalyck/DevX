import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";

import {
  PermissionAction,
  PermissionModule,
} from "./rbac";

export async function checkPermission(
  adminId: string,
  module: PermissionModule,
  action: PermissionAction
): Promise<boolean> {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
        deletedAt: null,
      },
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

    if (!admin || admin.status !== "ACTIVE") {
      return false;
    }

    if (admin.role.isSuperAdmin || admin.role.name === "CEO") {
      return true;
    }

    return admin.role.permissions.some(
      ({ permission }) =>
        permission.module === module &&
        (permission.action === action ||
          permission.action === "MANAGE")
    );
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
}

export async function requirePermission(
  module: PermissionModule,
  action: PermissionAction
): Promise<boolean> {
  const session = await getActiveSession();

  if (!session || session.userType !== "admin") {
    return false;
  }

  return checkPermission(session.id, module, action);
}