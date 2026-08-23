import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import SalesShell from "@/components/sales/SalesShell";

let pathname = "/sales";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

afterEach(() => {
  pathname = "/sales";
});

describe("SalesShell self-service navigation", () => {
  it("keeps profile and security inside the protected sales portal", () => {
    render(
      <SalesShell
        canManage={false}
        user={{
          firstName: "Amina",
          lastName: "Khan",
          avatar: null,
          role: "Sales Agent",
        }}
      >
        <div>Sales content</div>
      </SalesShell>
    );

    expect(screen.getByRole("link", { name: "Profile" }).getAttribute("href")).toBe(
      "/sales/profile"
    );
    expect(
      screen.getByRole("link", { name: "Open sales profile" }).getAttribute("href")
    ).toBe("/sales/profile");
    expect(
      screen
        .getAllByRole("link", { name: "Security" })
        .some((link) => link.getAttribute("href") === "/sales/security")
    ).toBe(true);
  });
});
