import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TeamManagementWorkspace from "@/components/team/TeamManagementWorkspace";

vi.mock("@/components/team/TeamAdmin", () => ({
  default: () => <div>Team profiles surface</div>,
}));

vi.mock("@/components/admin/TeamAccessManagement", () => ({
  default: () => <div>Team login access surface</div>,
}));

describe("TeamManagementWorkspace", () => {
  it("combines profiles and login access under tabs", () => {
    render(<TeamManagementWorkspace initialMembers={[]} />);

    const profilesTab = screen.getByRole("tab", { name: /Profiles/ });
    const accessTab = screen.getByRole("tab", { name: /Login Access/ });

    expect(profilesTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Team profiles surface")).toBeTruthy();
    expect(screen.queryByText("Team login access surface")).toBeNull();

    fireEvent.click(accessTab);

    expect(accessTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Team login access surface")).toBeTruthy();
    expect(screen.queryByText("Team profiles surface")).toBeNull();
  });

  it("opens the Login Access tab for a compatible access link", () => {
    render(<TeamManagementWorkspace initialMembers={[]} initialTab="access" />);

    expect(screen.getByRole("tab", { name: /Login Access/ }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Team login access surface")).toBeTruthy();
  });
});
