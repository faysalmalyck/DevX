type LoginRole = {
  name: string;
  isSuperAdmin?: boolean;
  permissions?: ReadonlyArray<{
    module: string;
    action: string;
  }>;
};

export type LoginPortal = "admin" | "sales";

const SALES_ROLE_NAMES = new Set(["Sales Agent", "Sales Manager"]);
const ADMIN_SALES_ROLE_NAMES = new Set(["CEO"]);

/**
 * Converts an untrusted return path into a same-origin application path.
 * Absolute, protocol-relative, malformed, and auth/API paths are rejected to
 * keep the login flow free of open redirects and redirect loops.
 */
export function safeReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.includes("\\") || value.includes("\u0000")) {
    return null;
  }

  try {
    const parsed = new URL(value, "https://devx.invalid");
    const path = parsed.pathname;

    if (
      path === "/login" ||
      path === "/sales/login" ||
      path.startsWith("/api/") ||
      path.startsWith("/r/")
    ) {
      return null;
    }

    return `${path}${parsed.search}`;
  } catch {
    return null;
  }
}

export function isSalesReturnPath(value: string | null | undefined): boolean {
  const pathname = value?.split("?", 1)[0];
  return pathname === "/sales" || Boolean(pathname?.startsWith("/sales/"));
}

export function salesLoginReturnTo(value: unknown): string {
  const candidate = safeReturnTo(value);
  return isSalesReturnPath(candidate) ? candidate! : "/sales";
}

export function roleHasSalesAccess(role: LoginRole): boolean {
  if (
    SALES_ROLE_NAMES.has(role.name) ||
    ADMIN_SALES_ROLE_NAMES.has(role.name) ||
    role.isSuperAdmin
  ) {
    return true;
  }

  return Boolean(
    role.permissions?.some(
      (permission) =>
        permission.module === "Leads" &&
        (permission.action === "VIEW" || permission.action === "MANAGE")
    )
  );
}

/**
 * Resolves a post-login path exclusively from the authenticated Admin role
 * and a validated return path. The client only receives the final result.
 */
export function adminLoginDestination(
  role: LoginRole,
  requestedReturnTo: unknown,
  portal: LoginPortal = "admin",
): string {
  const salesRole = SALES_ROLE_NAMES.has(role.name);
  const defaultDestination = salesRole ? "/sales" : "/admin";
  const candidate = safeReturnTo(requestedReturnTo);
  const candidatePathname = candidate?.split("?", 1)[0];

  if (portal === "sales") {
    if (!roleHasSalesAccess(role)) return "/admin";
    return isSalesReturnPath(candidate) ? candidate! : "/sales";
  }

  if (!candidate) return defaultDestination;

  if (isSalesReturnPath(candidate)) {
    return roleHasSalesAccess(role) ? candidate : defaultDestination;
  }

  if (
    candidatePathname === "/admin" ||
    candidatePathname?.startsWith("/admin/")
  ) {
    return salesRole ? "/sales" : candidate;
  }

  return defaultDestination;
}

/**
 * New operator credentials are changed before Sales work is available. This
 * remains server-selected so a browser cannot choose a weaker destination.
 */
export function adminPasswordChangeDestination(role: LoginRole): string {
  return SALES_ROLE_NAMES.has(role.name)
    ? "/sales/password-change"
    : "/admin/security?forcePasswordChange=1";
}

export function userLoginDestination(requestedReturnTo: unknown): string {
  const candidate = safeReturnTo(requestedReturnTo);
  const candidatePathname = candidate?.split("?", 1)[0];

  if (
    candidatePathname === "/account" ||
    candidatePathname?.startsWith("/account/")
  ) {
    return candidate!;
  }

  return "/dashboard";
}
