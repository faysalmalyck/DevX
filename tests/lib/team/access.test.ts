import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revokeAdminSessions: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  revokeAdminSessions: mocks.revokeAdminSessions,
}));

import {
  getTeamAccessDisplayRole,
  isProtectedTeamAdmin,
} from "@/lib/team/access";
import {
  synchronizeTeamMemberSalesAccess,
  TeamSalesSyncError,
} from "@/lib/team/sales-sync";

const ceoRole = { name: "CEO", isSuperAdmin: true };

function ceoTransaction() {
  let teamMemberLookups = 0;

  return {
    teamMember: {
      findFirst: vi.fn(() => {
        teamMemberLookups += 1;
        return Promise.resolve(
          teamMemberLookups === 1
            ? { id: "team-faysal", adminId: "admin-faysal" }
            : null,
        );
      }),
      update: vi.fn().mockResolvedValue({}),
    },
    admin: {
      findUnique: vi.fn(({ where }: { where: { id: string } }) => Promise.resolve(
        where.id === "actor-ceo"
          ? { role: ceoRole }
          : where.id === "admin-faysal"
            ? { id: "admin-faysal", role: ceoRole }
            : null,
      )),
      findFirst: vi.fn().mockResolvedValue({
        id: "admin-faysal",
        roleId: "ceo-role",
        agentCode: null,
        status: "ACTIVE",
        role: { id: "ceo-role", ...ceoRole },
      }),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn(),
    },
    role: { findUnique: vi.fn().mockResolvedValue({ id: "administrator-role" }) },
    lead: { count: vi.fn().mockResolvedValue(0) },
    leadFollowUp: { count: vi.fn().mockResolvedValue(0) },
    adminActivity: { create: vi.fn().mockResolvedValue({}) },
    auditLog: { create: vi.fn().mockResolvedValue({}) },
  };
}

function salesManagerTransaction() {
  return {
    teamMember: {
      findFirst: vi.fn().mockResolvedValue({ id: "team-gulfam", adminId: null }),
      update: vi.fn().mockResolvedValue({}),
    },
    admin: {
      findUnique: vi.fn(({ where }: { where: { id?: string } }) =>
        Promise.resolve(where.id ? { role: ceoRole } : null)),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "admin-gulfam", username: "gulfam-afzal", role: { name: "Sales Manager" } }),
    },
    role: { findUnique: vi.fn().mockResolvedValue({ id: "sales-manager-role" }) },
    adminActivity: { create: vi.fn().mockResolvedValue({}) },
    auditLog: { create: vi.fn().mockResolvedValue({}) },
  };
}

const faysalInput = {
  actorId: "actor-ceo",
  teamMemberId: "team-faysal",
  department: "EXECUTIVE",
  salesRole: null,
  email: "faysal@devx.pk",
  name: "Faysal Mushtaq",
  title: "CEO & Founder",
} as const;

describe("Team access CEO policy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("derives CEO display access from a linked CEO without replacing its stored Administrator access", () => {
    expect(getTeamAccessDisplayRole({
      accessRole: "ADMINISTRATOR",
      salesRole: null,
      admin: { role: ceoRole },
    })).toBe("CEO");

    expect(getTeamAccessDisplayRole({
      accessRole: "ADMINISTRATOR",
      salesRole: null,
      admin: { role: { name: "Platform Owner", isSuperAdmin: true } },
    })).toBe("CEO");

    expect(getTeamAccessDisplayRole({
      accessRole: "ADMINISTRATOR",
      salesRole: null,
      admin: null,
    })).toBe("ADMINISTRATOR");
  });

  it("recognizes both the CEO role and arbitrary super-admin roles as protected", () => {
    expect(isProtectedTeamAdmin({ name: "CEO", isSuperAdmin: false })).toBe(true);
    expect(isProtectedTeamAdmin({ name: "Platform Owner", isSuperAdmin: true })).toBe(true);
    expect(isProtectedTeamAdmin({ name: "Administrator", isSuperAdmin: false })).toBe(false);
  });

  it("rejects attempts to revoke a linked CEO before suspending, unlinking, or revoking sessions", async () => {
    const transaction = ceoTransaction();

    await expect(synchronizeTeamMemberSalesAccess(transaction as never, {
      ...faysalInput,
      accessRole: "NONE",
    })).rejects.toMatchObject({
      name: TeamSalesSyncError.name,
      status: 403,
    });

    expect(transaction.admin.update).not.toHaveBeenCalled();
    expect(transaction.teamMember.update).not.toHaveBeenCalled();
    expect(mocks.revokeAdminSessions).not.toHaveBeenCalled();
  });

  it("permits a linked CEO to retain compatible Administrator access without changing the CEO identity", async () => {
    const transaction = ceoTransaction();

    const result = await synchronizeTeamMemberSalesAccess(transaction as never, {
      ...faysalInput,
      accessRole: "ADMINISTRATOR",
    });

    expect(result.adminId).toBe("admin-faysal");
    expect(transaction.admin.update).not.toHaveBeenCalled();
    expect(mocks.revokeAdminSessions).not.toHaveBeenCalled();
    expect(transaction.teamMember.update).toHaveBeenCalledWith(expect.objectContaining({
      data: {
        adminId: "admin-faysal",
        accessRole: "ADMINISTRATOR",
        salesRole: null,
      },
    }));
  });

  it("invites a valid Sales Manager and links the TeamMember to the new Admin identity", async () => {
    const transaction = salesManagerTransaction();

    const result = await synchronizeTeamMemberSalesAccess(transaction as never, {
      actorId: "actor-ceo",
      teamMemberId: "team-gulfam",
      department: "SALES",
      accessRole: "SALES_MANAGER",
      salesRole: "SALES_MANAGER",
      email: "gulfam@example.com",
      name: "Gulfam Afzal",
      title: "Sales Manager",
      temporaryPassword: "DevX-Temporary-123!",
      temporaryPasswordHash: "hashed-temporary-password",
    });

    expect(result).toMatchObject({
      action: "invited",
      adminId: "admin-gulfam",
      username: "gulfam-afzal",
      temporaryPassword: "DevX-Temporary-123!",
      role: "Sales Manager",
    });
    expect(transaction.admin.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        email: "gulfam@example.com",
        roleId: "sales-manager-role",
        status: "ACTIVE",
        requirePasswordChange: true,
      }),
    }));
    expect(transaction.teamMember.update).toHaveBeenCalledWith({
      where: { id: "team-gulfam" },
      data: {
        adminId: "admin-gulfam",
        accessRole: "SALES_MANAGER",
        salesRole: "SALES_MANAGER",
      },
    });
  });
});
