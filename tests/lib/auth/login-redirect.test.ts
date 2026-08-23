import { describe, expect, it } from "vitest";

import {
  adminLoginDestination,
  adminPasswordChangeDestination,
  safeReturnTo,
  salesLoginReturnTo,
  userLoginDestination,
} from "@/lib/auth/login-redirect";

describe("login return-path handling", () => {
  it("accepts only safe same-origin application paths", () => {
    expect(safeReturnTo("/sales/leads?status=NEW")).toBe(
      "/sales/leads?status=NEW"
    );
    expect(safeReturnTo("https://attacker.example")).toBeNull();
    expect(safeReturnTo("//attacker.example")).toBeNull();
    expect(safeReturnTo("/api/auth/login")).toBeNull();
    expect(safeReturnTo("/sales/login")).toBeNull();
  });

  it("routes Sales roles to the sales workspace from the canonical login", () => {
    expect(
      adminLoginDestination({ name: "Sales Agent" }, "/admin")
    ).toBe("/sales");
    expect(
      adminLoginDestination({ name: "Sales Manager" }, "/sales?preset=month")
    ).toBe("/sales?preset=month");
  });

  it("keeps non-sales administrators on Admin unless they have live sales access", () => {
    expect(
      adminLoginDestination({ name: "Administrator" }, "/sales")
    ).toBe("/admin");
    expect(
      adminLoginDestination(
        {
          name: "Administrator",
          permissions: [{ module: "Leads", action: "VIEW" }],
        },
        "/sales"
      )
    ).toBe("/sales");
    expect(
      adminLoginDestination({ name: "Content Manager" }, "/sales")
    ).toBe("/admin");
    expect(
      adminLoginDestination(
        {
          name: "Custom Role",
          permissions: [{ module: "Leads", action: "VIEW" }],
        },
        "/sales/follow-ups"
      )
    ).toBe("/sales/follow-ups");
  });

  it("honors the canonical Sales intent only for roles with Sales access", () => {
    expect(adminLoginDestination({ name: "Sales Agent" }, undefined, "sales")).toBe("/sales");
    expect(adminLoginDestination({ name: "CEO" }, undefined, "sales")).toBe("/sales");
    expect(
      adminLoginDestination(
        { name: "Administrator", permissions: [{ module: "Leads", action: "VIEW" }] },
        "/sales/leads",
        "sales",
      ),
    ).toBe("/sales/leads");
    expect(adminLoginDestination({ name: "Content Manager" }, undefined, "sales")).toBe("/admin");
  });

  it("preserves only Sales paths for the compatibility login route", () => {
    expect(salesLoginReturnTo("/sales/pipeline?view=board")).toBe(
      "/sales/pipeline?view=board"
    );
    expect(salesLoginReturnTo("/admin")).toBe("/sales");
    expect(userLoginDestination("/account?tab=security")).toBe("/account?tab=security");
    expect(userLoginDestination("/sales")).toBe("/dashboard");
  });

  it("sends newly provisioned Sales accounts through a password change first", () => {
    expect(adminPasswordChangeDestination({ name: "Sales Agent" })).toBe(
      "/sales/password-change"
    );
    expect(adminPasswordChangeDestination({ name: "CEO" })).toBe(
      "/admin/security?forcePasswordChange=1"
    );
  });
});
