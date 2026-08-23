import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  adminFindUnique: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: { admin: { findUnique: mocks.adminFindUnique } },
}));

import { checkPermission } from "@/lib/permissions/rbac.server";

describe("server admin permissions", () => {
  beforeEach(() => {
    mocks.adminFindUnique.mockReset();
  });

  it("allows the active CEO to grant Team Members access without explicit permission rows", async () => {
    mocks.adminFindUnique.mockResolvedValue({
      status: "ACTIVE",
      role: { name: "CEO", isSuperAdmin: true, permissions: [] },
    });

    await expect(checkPermission("ceo-faysal-mushtaq", "Team Members", "EDIT")).resolves.toBe(true);
  });

  it("denies an active non-super-admin without the requested permission", async () => {
    mocks.adminFindUnique.mockResolvedValue({
      status: "ACTIVE",
      role: { name: "Content Manager", isSuperAdmin: false, permissions: [] },
    });

    await expect(checkPermission("content-admin", "Team Members", "EDIT")).resolves.toBe(false);
  });
});
