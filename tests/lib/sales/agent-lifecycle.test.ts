import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const tx = {
    admin: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    role: { findUnique: vi.fn() },
    lead: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    leadFollowUp: {
      count: vi.fn(),
      updateMany: vi.fn(),
    },
    leadActivity: { createMany: vi.fn() },
    adminActivity: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  };

  return {
    tx,
    prisma: {
      admin: { findMany: vi.fn() },
      $transaction: vi.fn(async (operation: (transaction: typeof tx) => unknown) => operation(tx)),
    },
    revokeAdminSessions: vi.fn(),
  };
});

vi.mock("@/lib/db/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/auth/session", () => ({ revokeAdminSessions: mocks.revokeAdminSessions }));

import {
  isSalesTeamRole,
  createSalesAccount,
  suspendSalesAccount,
} from "@/lib/sales/agent-lifecycle";

function resetMocks() {
  vi.clearAllMocks();
  mocks.tx.admin.findFirst.mockReset();
  mocks.tx.admin.updateMany.mockReset();
  mocks.tx.admin.findUnique.mockReset();
  mocks.tx.admin.create.mockReset();
  mocks.tx.role.findUnique.mockReset();
  mocks.tx.lead.findMany.mockReset();
  mocks.tx.lead.updateMany.mockReset();
  mocks.tx.leadFollowUp.count.mockReset();
  mocks.tx.leadFollowUp.updateMany.mockReset();
  mocks.tx.leadActivity.createMany.mockReset();
  mocks.tx.adminActivity.create.mockReset();
  mocks.tx.auditLog.create.mockReset();
}

describe("Sales account lifecycle", () => {
  it("recognizes only explicit Sales team roles", () => {
    expect(isSalesTeamRole("Sales Agent")).toBe(true);
    expect(isSalesTeamRole("Sales Manager")).toBe(true);
    expect(isSalesTeamRole("Administrator")).toBe(false);
  });

  it("atomically hands off live work and revokes sessions before suspension completes", async () => {
    resetMocks();
    mocks.tx.admin.findFirst
      .mockResolvedValueOnce({
        id: "outgoing-agent",
        firstName: "Outgoing",
        lastName: "Agent",
        status: "ACTIVE",
        role: { name: "Sales Agent" },
      })
      .mockResolvedValueOnce({ id: "replacement-agent" });
    mocks.tx.lead.findMany.mockResolvedValue([{ id: "lead-1" }, { id: "lead-2" }]);
    mocks.tx.leadFollowUp.count.mockResolvedValue(1);
    mocks.tx.admin.updateMany.mockResolvedValue({ count: 1 });
    mocks.tx.lead.updateMany.mockResolvedValue({ count: 2 });
    mocks.tx.leadFollowUp.updateMany.mockResolvedValue({ count: 1 });
    mocks.tx.leadActivity.createMany.mockResolvedValue({ count: 2 });
    mocks.revokeAdminSessions.mockResolvedValue(3);
    mocks.tx.adminActivity.create.mockResolvedValue({});
    mocks.tx.auditLog.create.mockResolvedValue({});

    const result = await suspendSalesAccount({
      actorId: "super-admin",
      accountId: "outgoing-agent",
      reassignToAgentId: "replacement-agent",
    });

    expect(result).toEqual({
      accountId: "outgoing-agent",
      status: "SUSPENDED",
      reassignedLeadCount: 2,
      reassignedFollowUpCount: 1,
    });
    expect(mocks.tx.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: { assignedAgentId: "replacement-agent" },
    }));
    expect(mocks.tx.leadFollowUp.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: { assignedAgentId: "replacement-agent" },
    }));
    expect(mocks.revokeAdminSessions).toHaveBeenCalledWith("outgoing-agent", mocks.tx);
  });

  it("hashes an initial credential and records no plaintext secret when provisioning", async () => {
    resetMocks();
    mocks.tx.role.findUnique.mockResolvedValue({ id: "sales-agent-role", name: "Sales Agent" });
    mocks.tx.admin.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    mocks.tx.admin.findUnique.mockResolvedValue(null);
    mocks.tx.admin.create.mockResolvedValue({
      id: "new-agent",
      firstName: "New",
      lastName: "Agent",
      email: "new.agent@example.com",
      username: "newagent",
      agentCode: "new-agent-1234abcd",
      status: "ACTIVE",
    });
    mocks.tx.adminActivity.create.mockResolvedValue({});
    mocks.tx.auditLog.create.mockResolvedValue({});

    const account = await createSalesAccount({
      actorId: "super-admin",
      firstName: "New",
      lastName: "Agent",
      email: "New.Agent@example.com",
      username: "newagent",
      initialPassword: "Initial-Password-123!",
      role: "Sales Agent",
    });

    expect(account.role).toBe("Sales Agent");
    const createCall = mocks.tx.admin.create.mock.calls[0]?.[0];
    expect(createCall.data.password).not.toBe("Initial-Password-123!");
    expect(createCall.data.requirePasswordChange).toBe(true);
    expect(JSON.stringify(mocks.tx.auditLog.create.mock.calls)).not.toContain("Initial-Password-123!");
  });

  it("rejects suspension with active work until a replacement is explicitly supplied", async () => {
    resetMocks();
    mocks.tx.admin.findFirst.mockResolvedValue({
      id: "outgoing-agent",
      firstName: "Outgoing",
      lastName: "Agent",
      status: "ACTIVE",
      role: { name: "Sales Agent" },
    });
    mocks.tx.lead.findMany.mockResolvedValue([{ id: "lead-1" }]);
    mocks.tx.leadFollowUp.count.mockResolvedValue(0);

    await expect(suspendSalesAccount({
      actorId: "super-admin",
      accountId: "outgoing-agent",
    })).rejects.toMatchObject({
      status: 422,
    });

    expect(mocks.tx.admin.updateMany).not.toHaveBeenCalled();
    expect(mocks.revokeAdminSessions).not.toHaveBeenCalled();
  });
});
