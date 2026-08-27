import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthCookies: vi.fn(),
  setAuthCookies: vi.fn(),
  clearAuthCookies: vi.fn(),
  verifyToken: vi.fn(),
  createTokenPair: vi.fn(),
  adminSessionFindFirst: vi.fn(),
  adminSessionUpdateMany: vi.fn(),
  userSessionFindFirst: vi.fn(),
  userSessionUpdateMany: vi.fn(),
}));

vi.mock("@/lib/auth/cookies", () => ({
  getAuthCookies: mocks.getAuthCookies,
  setAuthCookies: mocks.setAuthCookies,
  clearAuthCookies: mocks.clearAuthCookies,
}));

vi.mock("@/lib/auth/jwt", () => ({
  AuthConfigurationError: class AuthConfigurationError extends Error {},
  verifyToken: mocks.verifyToken,
  createTokenPair: mocks.createTokenPair,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    adminSession: {
      findFirst: mocks.adminSessionFindFirst,
      updateMany: mocks.adminSessionUpdateMany,
    },
    userSession: {
      findFirst: mocks.userSessionFindFirst,
      updateMany: mocks.userSessionUpdateMany,
    },
  },
}));

import { POST } from "@/app/api/auth/refresh/route";

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.clearAuthCookies.mockResolvedValue(undefined);
  });

  it("returns 401 when no refresh token is present", async () => {
    mocks.getAuthCookies.mockResolvedValue({ refreshToken: undefined });

    const response = await POST();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Refresh token missing" });
  });

  it("returns 500 without clearing cookies when session storage is unavailable", async () => {
    mocks.getAuthCookies.mockResolvedValue({ refreshToken: "refresh-token" });
    mocks.verifyToken.mockResolvedValue({
      sub: "admin-1",
      email: "admin@example.test",
      role: "Administrator",
      userType: "admin",
      type: "refresh",
      sessionId: "session-1",
    });
    mocks.adminSessionFindFirst.mockRejectedValue(new Error("database unavailable"));

    const response = await POST();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Authentication service is temporarily unavailable",
    });
    expect(mocks.clearAuthCookies).not.toHaveBeenCalled();
  });
});
