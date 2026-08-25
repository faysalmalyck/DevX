import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TeamAccessManagement from "@/components/admin/TeamAccessManagement";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("TeamAccessManagement CEO presentation", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let postResponse: Response | null;
  const gulfam = {
    id: "team-gulfam",
    name: "Gulfam Afzal",
    role: "Sales Manager",
    department: "SALES",
    email: "gulfam@example.com",
    accessRole: "NONE",
    salesRole: null,
    admin: null,
  };
  const gulfamWithAccess = {
    ...gulfam,
    accessRole: "SALES_MANAGER",
    salesRole: "SALES_MANAGER",
    admin: {
      id: "admin-gulfam",
      email: "gulfam@example.com",
      status: "ACTIVE",
      lastLogin: null,
      agentCode: "GULFAM-001",
      role: { name: "Sales Manager", isSuperAdmin: false },
    },
  };

  beforeEach(() => {
    postResponse = null;
    document.cookie = "DevX-csrf-token=test-csrf";
    vi.spyOn(window, "prompt").mockImplementation(() => null);
    fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "/api/auth/csrf") return jsonResponse({ success: true });
      if (url === "/api/admin/team-access" && init?.method === "POST") {
        if (!postResponse) throw new Error("No POST response configured");
        return postResponse;
      }
      if (url === "/api/admin/team-access") {
        return jsonResponse({
          members: [{
            id: "team-faysal",
            name: "Faysal Mushtaq",
            role: "CEO & Founder",
            department: "EXECUTIVE",
            email: "faysal@devx.pk",
            accessRole: "CEO",
            salesRole: null,
            admin: {
              id: "admin-faysal",
              email: "faysal@devx.pk",
              status: "ACTIVE",
              lastLogin: null,
              agentCode: null,
              role: { name: "CEO", isSuperAdmin: true },
            },
          }],
        });
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows a linked CEO as protected access rather than no login access", async () => {
    render(<TeamAccessManagement />);

    const faysalRow = await screen.findByRole("row", { name: /Faysal Mushtaq/ });
    expect(within(faysalRow).getByText("CEO • Super Admin")).toBeTruthy();
    expect(within(faysalRow).getByText("Protected CEO account")).toBeTruthy();
    expect(within(faysalRow).queryByRole("button", { name: "Manage Access" })).toBeNull();
  });

  it("shows failed save errors inside the dialog and keeps the selected access role", async () => {
    postResponse = jsonResponse({ error: "Invalid request token." }, 403);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "/api/admin/team-access" && init?.method === "POST") return postResponse!;
      if (url === "/api/admin/team-access") return jsonResponse({ members: [gulfam] });
      if (url === "/api/auth/csrf") return jsonResponse({ success: true });
      throw new Error(`Unexpected request: ${url}`);
    });

    render(<TeamAccessManagement />);
    const row = await screen.findByRole("row", { name: /Gulfam Afzal/ });
    fireEvent.click(within(row).getByRole("button", { name: "Manage Access" }));

    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByRole("combobox", { name: "Login access" }), {
      target: { value: "SALES_MANAGER" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save access" }));

    expect((await within(dialog).findByRole("alert")).textContent).toContain("Invalid request token.");
    expect((within(dialog).getByRole("combobox", { name: "Login access" }) as HTMLSelectElement).value).toBe("SALES_MANAGER");
  });

  it("creates Gulfam's Sales Manager access and closes the dialog on success", async () => {
    postResponse = jsonResponse({
      success: true,
      accessRole: "SALES_MANAGER",
      adminId: "admin-gulfam",
      status: "invited",
      credentials: {
        email: "gulfam@example.com",
        username: "gulfam-afzal",
        temporaryPassword: "DevX-Temporary-123!",
        adminLoginUrl: "https://example.com/login?portal=admin",
        salesLoginUrl: "https://example.com/login?portal=sales",
      },
    });
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "/api/admin/team-access" && init?.method === "POST") return postResponse!;
      if (url === "/api/admin/team-access") return jsonResponse({ members: [gulfam] });
      if (url === "/api/auth/csrf") return jsonResponse({ success: true });
      throw new Error(`Unexpected request: ${url}`);
    });

    render(<TeamAccessManagement />);
    const row = await screen.findByRole("row", { name: /Gulfam Afzal/ });
    fireEvent.click(within(row).getByRole("button", { name: "Manage Access" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByRole("combobox", { name: "Login access" }), {
      target: { value: "SALES_MANAGER" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save access" }));

    await waitFor(() => expect(screen.getByRole("dialog", { name: "Login created" })).toBeTruthy());
    expect(screen.getByRole("status").textContent).toContain("Gulfam Afzal now has Sales Manager.");
    expect(screen.getByText("DevX-Temporary-123!")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sales login" }).getAttribute("href")).toBe("https://example.com/login?portal=sales");
    const postCall = fetchMock.mock.calls.find(([, init]) => init?.method === "POST");
    expect(postCall?.[1]?.body).toBe(JSON.stringify({ teamMemberId: "team-gulfam", accessRole: "SALES_MANAGER" }));
  });

  it("requires confirmation before removing a member's login access", async () => {
    let removed = false;
    postResponse = jsonResponse({
      success: true,
      accessRole: "NONE",
      adminId: "admin-gulfam",
      status: "removed",
      credentials: null,
    });
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "/api/admin/team-access" && init?.method === "POST") {
        removed = true;
        return postResponse!;
      }
      if (url === "/api/admin/team-access") {
        return jsonResponse({ members: [removed ? gulfam : gulfamWithAccess] });
      }
      if (url === "/api/auth/csrf") return jsonResponse({ success: true });
      throw new Error(`Unexpected request: ${url}`);
    });

    render(<TeamAccessManagement />);
    const row = await screen.findByRole("row", { name: /Gulfam Afzal/ });
    fireEvent.click(within(row).getByRole("button", { name: "Manage Access" }));

    const accessDialog = screen.getByRole("dialog", { name: /Manage access for Gulfam Afzal/ });
    fireEvent.click(within(accessDialog).getByRole("button", { name: "Remove access" }));

    const confirmation = screen.getByRole("dialog", { name: /Remove login access/ });
    fireEvent.click(within(confirmation).getByRole("button", { name: "Cancel" }));
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === "POST")).toBe(false);

    fireEvent.click(within(accessDialog).getByRole("button", { name: "Remove access" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: /Remove login access/ })).getByRole("button", { name: "Remove access" }));

    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Login access was removed for Gulfam Afzal."));
    const postCall = fetchMock.mock.calls.find(([, init]) => init?.method === "POST");
    expect(postCall?.[1]?.body).toBe(JSON.stringify({ teamMemberId: "team-gulfam", accessRole: "NONE" }));
  });

  it("keeps the access dialog open when removal is blocked", async () => {
    postResponse = jsonResponse({ error: "Reassign active Sales work before removing access from this TeamMember." }, 422);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "/api/admin/team-access" && init?.method === "POST") return postResponse!;
      if (url === "/api/admin/team-access") return jsonResponse({ members: [gulfamWithAccess] });
      if (url === "/api/auth/csrf") return jsonResponse({ success: true });
      throw new Error(`Unexpected request: ${url}`);
    });

    render(<TeamAccessManagement />);
    const row = await screen.findByRole("row", { name: /Gulfam Afzal/ });
    fireEvent.click(within(row).getByRole("button", { name: "Manage Access" }));

    const accessDialog = screen.getByRole("dialog", { name: /Manage access for Gulfam Afzal/ });
    fireEvent.click(within(accessDialog).getByRole("button", { name: "Remove access" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: /Remove login access/ })).getByRole("button", { name: "Remove access" }));

    expect((await within(accessDialog).findByRole("alert")).textContent).toContain("Reassign active Sales work");
    expect(screen.queryByRole("dialog", { name: /Remove login access/ })).toBeNull();
  });
});
