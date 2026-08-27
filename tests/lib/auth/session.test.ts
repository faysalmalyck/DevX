import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthCookies: vi.fn(),
  setAuthCookies: vi.fn(),
  clearAuthCookies: vi.fn(),
  verifyToken: vi.fn(),
  createTokenPair: vi.fn(),
  adminSessionFindUnique: vi.fn(),
  adminFindUnique: vi.fn(),
}));

vi.mock("@/lib/auth/cookies", () => ({
  getAuthCookies: mocks.getAuthCookies,
  setAuthCookies: mocks.setAuthCookies,
  clearAuthCookies: mocks.clearAuthCookies,
  isCookieMutationUnavailable: () => false,
}));

vi.mock("@/lib/auth/jwt", () => ({
  AuthConfigurationError: class AuthConfigurationError extends Error {},
  verifyToken: mocks.verifyToken,
  createTokenPair: mocks.createTokenPair,
  getRefreshExpiry: () => new Date(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    adminSession: { findUnique: mocks.adminSessionFindUnique },
    admin: { findUnique: mocks.adminFindUnique },
  },
}));

import { getActiveSession } from "@/lib/auth/session";

describe("getActiveSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.setAuthCookies.mockResolvedValue(undefined);
    mocks.clearAuthCookies.mockResolvedValue(undefined);
    mocks.createTokenPair.mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    mocks.adminSessionFindUnique.mockResolvedValue({
      id: "session-1",
      expiresAt: new Date(Date.now() + 60_000),
    });
    mocks.adminFindUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.test",
      firstName: "Ada",
      lastName: "Lovelace",
      username: "ada",
      avatar: null,
      status: "ACTIVE",
      requirePasswordChange: false,
      role: { name: "Administrator" },
    });
  });

  it("restores a valid refresh session when the expired access cookie is absent", async () => {
    mocks.getAuthCookies
      .mockResolvedValueOnce({ accessToken: undefined, refreshToken: "refresh-token" })
      .mockResolvedValueOnce({ accessToken: undefined, refreshToken: "refresh-token" });
    mocks.verifyToken.mockResolvedValue({
      sub: "admin-1",
      email: "admin@example.test",
      role: "Administrator",
      userType: "admin",
      type: "refresh",
      sessionId: "session-1",
    });

    await expect(getActiveSession()).resolves.toMatchObject({
      id: "admin-1",
      sessionId: "session-1",
      userType: "admin",
    });

    expect(mocks.verifyToken).toHaveBeenCalledWith("refresh-token", "refresh");
    expect(mocks.setAuthCookies).toHaveBeenCalledWith(
      "new-access-token",
      "new-refresh-token"
    );
  });

  it("does not erase valid cookies when the backing database is unavailable", async () => {
    mocks.getAuthCookies.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    mocks.verifyToken.mockResolvedValue({
      sub: "admin-1",
      email: "admin@example.test",
      role: "Administrator",
      userType: "admin",
      type: "access",
      sessionId: "session-1",
    });
    mocks.adminSessionFindUnique.mockRejectedValue(new Error("database unavailable"));

    await expect(getActiveSession()).rejects.toThrow("database unavailable");
    expect(mocks.clearAuthCookies).not.toHaveBeenCalled();
  });
});
