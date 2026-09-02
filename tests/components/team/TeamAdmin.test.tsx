import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TeamAdmin from "@/components/team/TeamAdmin";
import type { TeamMemberRecord } from "@/lib/team/types";

vi.mock("@/components/ui/Toast", () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

function member(overrides: Partial<TeamMemberRecord> = {}): TeamMemberRecord {
  return {
    id: "existing-member",
    name: "Existing Complete Member",
    slug: "existing-complete-member",
    role: "Executive",
    department: "EXECUTIVE",
    legacyDepartment: null,
    bio: "An existing complete team member used to keep the initial list rendered.",
    about: null,
    highlights: [],
    experience: null,
    image: null,
    email: null,
    phone: null,
    linkedinUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    githubUrl: null,
    displayOrder: 0,
    featured: false,
    status: "DRAFT",
    profileStatus: "COMPLETE",
    createdAt: "2026-08-11T00:00:00.000Z",
    updatedAt: "2026-08-11T00:00:00.000Z",
    ...overrides,
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("TeamAdmin profile status refresh", () => {
  let storedMembers: TeamMemberRecord[];
  let createdMember: TeamMemberRecord | undefined;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.cookie = "DevX-csrf-token=test-token; path=/";
    storedMembers = [member()];

    fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method ?? "GET";

      if (url === "/api/auth/csrf") return jsonResponse({});

      if (url === "/api/admin/team" && method === "GET") {
        return jsonResponse({ data: storedMembers });
      }

      if (url === "/api/admin/team" && method === "POST") {
        const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
        createdMember = member({
          id: "new-member",
          name: String(payload.name),
          slug: String(payload.slug),
          role: String(payload.role),
          department: payload.department as TeamMemberRecord["department"],
          bio: String(payload.bio),
          email: (payload.email as string | null | undefined) ?? null,
          profileStatus: "INCOMPLETE",
        });
        storedMembers = [...storedMembers, createdMember];
        return jsonResponse({ data: createdMember }, 201);
      }

      if (url === "/api/admin/team/new-member" && method === "PATCH") {
        const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
        createdMember = member({
          ...createdMember,
          id: "new-member",
          name: String(payload.name),
          slug: String(payload.slug),
          role: String(payload.role),
          department: payload.department as TeamMemberRecord["department"],
          bio: String(payload.bio),
          email: (payload.email as string | null | undefined) ?? null,
          profileStatus: "COMPLETE",
        });
        storedMembers = storedMembers.map((current) =>
          current.id === createdMember?.id ? createdMember : current,
        );
        return jsonResponse({ data: createdMember });
      }

      throw new Error(`Unexpected request: ${method} ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    document.cookie = "DevX-csrf-token=; path=/; max-age=0";
  });

  it("creates an incomplete draft without a department, then shows Complete after the department is saved", async () => {
    const user = userEvent.setup();
    render(<TeamAdmin initialMembers={storedMembers} />);

    await user.click(screen.getByRole("button", { name: "Add Member" }));
    await user.type(screen.getByLabelText(/Full name/), "Avery Patel");
    await user.type(screen.getByLabelText(/Role/), "Software Engineer");
    await user.type(
      screen.getByLabelText(/Biography/),
      "Avery builds reliable internal tools for the engineering organization.",
    );
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    const incompleteRow = await screen.findByRole("row", { name: /Avery Patel/ });
    expect(within(incompleteRow).getByText("Incomplete")).toBeTruthy();

    const createRequest = fetchMock.mock.calls.find(([, init]) => init?.method === "POST");
    expect(createRequest).toBeDefined();
    expect(JSON.parse(String(createRequest?.[1]?.body))).toMatchObject({
      department: null,
    });

    await user.click(within(incompleteRow).getByRole("button", { name: "Edit Avery Patel" }));
    const departmentSelect = screen.getByLabelText(/Department/) as HTMLSelectElement;
    expect(departmentSelect.value).toBe("");
    await user.selectOptions(departmentSelect, "ENGINEERING");
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    await waitFor(() => {
      const completeRow = screen.getByRole("row", { name: /Avery Patel/ });
      expect(within(completeRow).getByText("Complete")).toBeTruthy();
      expect(within(completeRow).queryByText("Incomplete")).toBeNull();
    });

    const updateRequest = fetchMock.mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(updateRequest).toBeDefined();
    expect(JSON.parse(String(updateRequest?.[1]?.body))).toMatchObject({
      department: "ENGINEERING",
    });
  });

  it("submits the dedicated profile-page content with ordered highlights", async () => {
    const user = userEvent.setup();
    render(<TeamAdmin initialMembers={storedMembers} />);

    await user.click(screen.getByRole("button", { name: "Add Member" }));
    await user.type(screen.getByLabelText(/Full name/), "Ada Lovelace");
    await user.type(screen.getByLabelText(/Public title/), "Principal Engineer");
    await user.selectOptions(screen.getByLabelText(/Department/), "ENGINEERING");
    await user.type(screen.getByLabelText(/Biography/), "Ada leads the engineering team and maintains the developer platform.");
    await user.type(screen.getByLabelText("About"), "Ada builds the engineering foundations behind DevX.");
    await user.click(screen.getByRole("button", { name: "Add highlight" }));
    await user.type(screen.getByLabelText("Highlight 1"), "Leads the platform team");
    await user.click(screen.getByRole("button", { name: "Add highlight" }));
    await user.type(screen.getByLabelText("Highlight 2"), "Improves delivery systems");
    await user.click(screen.getByRole("button", { name: "Move highlight 2 up" }));
    await user.type(screen.getByLabelText("Experience"), "Ada has led technical teams across product and platform delivery.");
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    await waitFor(() => {
      const createRequest = fetchMock.mock.calls.find(([, init]) => init?.method === "POST");
      expect(createRequest).toBeDefined();
      expect(JSON.parse(String(createRequest?.[1]?.body))).toMatchObject({
        about: "Ada builds the engineering foundations behind DevX.",
        highlights: ["Improves delivery systems", "Leads the platform team"],
        experience: "Ada has led technical teams across product and platform delivery.",
      });
    });
  });
});
