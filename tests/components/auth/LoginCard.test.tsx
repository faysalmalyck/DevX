import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginCard from "@/components/auth/LoginCard";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  signup: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.push,
    replace: mocks.replace,
  }),
}));

vi.mock("@/contexts/SessionContext", () => ({
  useSession: () => ({
    login: mocks.login,
    signup: mocks.signup,
  }),
}));

function roleToggleLabels() {
  return screen
    .getAllByRole("button")
    .filter((button) => button.hasAttribute("aria-pressed"))
    .map((button) => button.textContent?.trim());
}

describe("LoginCard portal selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.login.mockResolvedValue({ redirectTo: "/sales" });
  });

  it("shows only User and Admin as role toggles on the main login", () => {
    render(<LoginCard />);

    expect(roleToggleLabels()).toEqual(["User", "Admin"]);
    expect(screen.queryByRole("button", { name: /sales login/i })).toBeNull();
  });

  it("opens Sales Login as an Admin sub-tab while keeping the two primary toggles", () => {
    render(
      <LoginCard
        initialRole="admin"
        initialPortal="sales"
      />,
    );

    expect(roleToggleLabels()).toEqual(["User", "Admin"]);
    expect(screen.getAllByRole("heading", { name: "Sales access" }).length).toBeGreaterThan(0);
    expect(
      screen.getByText("Sign in with your existing DevX administrator credentials."),
    ).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Sales Login" }).getAttribute("aria-selected")).toBe("true");

    fireEvent.click(screen.getByRole("tab", { name: "Admin Login" }));
    expect(screen.getByRole("heading", { name: "Operator Terminal" })).toBeTruthy();
  });

  it("submits Sales Login through the admin endpoint with sales portal intent", async () => {
    render(<LoginCard initialRole="admin" initialPortal="sales" />);

    fireEvent.change(screen.getByPlaceholderText("admin@DevX.digital"), {
      target: { value: "sales@devx.digital" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secure-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Authenticate" }));

    await waitFor(() => {
      expect(mocks.login).toHaveBeenCalledWith({
        email: "sales@devx.digital",
        password: "secure-password",
        role: "admin",
        portal: "sales",
        rememberMe: false,
        returnTo: undefined,
      });
    });
  });
});
