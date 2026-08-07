import { getActiveSession, type SessionUser } from "@/lib/auth/session";
import { validateCsrfToken } from "@/lib/auth/csrf";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import {
  checkPermission,
} from "@/lib/permissions/rbac.server";
import type {
  PermissionAction,
  PermissionModule,
} from "@/lib/permissions/rbac";

export type AdminAuthorizationResult =
  | { ok: true; session: SessionUser }
  | { ok: false; status: 401 | 403 };

export async function authorizeAdmin(
  module: PermissionModule,
  action: PermissionAction
): Promise<AdminAuthorizationResult> {
  const session = await getActiveSession();

  if (!session || session.userType !== "admin") {
    return { ok: false, status: 401 };
  }

  const allowed = await checkPermission(session.id, module, action);
  if (!allowed) {
    return { ok: false, status: 403 };
  }

  return { ok: true, session };
}

export function hasValidAdminCsrf(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieToken = cookieHeader
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAMES.CSRF_TOKEN}=`))
    ?.slice(COOKIE_NAMES.CSRF_TOKEN.length + 1);

  try {
    return validateCsrfToken(
      cookieToken ? decodeURIComponent(cookieToken) : undefined,
      request.headers.get("x-csrf-token")
    );
  } catch {
    return false;
  }
}
