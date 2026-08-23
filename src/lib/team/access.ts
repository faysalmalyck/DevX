export const teamAccessRoles = [
  "NONE",
  "ADMINISTRATOR",
  "SALES_MANAGER",
  "SALES_AGENT",
] as const;

export type ManagedTeamAccessRole = (typeof teamAccessRoles)[number];
export type StoredTeamAccessRole = Exclude<ManagedTeamAccessRole, "NONE">;
export type TeamAccessDisplayRole = ManagedTeamAccessRole | "CEO";

export type TeamAdminRole = {
  name: string;
  isSuperAdmin: boolean;
};

export function isProtectedTeamAdmin(role: TeamAdminRole | null | undefined): boolean {
  return role?.isSuperAdmin === true || role?.name === "CEO";
}

/**
 * The stored TeamMember access role controls the managed access workflow.
 * A linked CEO remains a protected CEO/Super Admin identity even when its
 * stored access role is the compatible ADMINISTRATOR value.
 */
export function getTeamAccessDisplayRole(input: {
  accessRole: StoredTeamAccessRole | null;
  salesRole: "SALES_MANAGER" | "SALES_AGENT" | null;
  admin: { role: TeamAdminRole } | null;
}): TeamAccessDisplayRole {
  if (isProtectedTeamAdmin(input.admin?.role)) return "CEO";

  return input.accessRole ?? input.salesRole ?? "NONE";
}
