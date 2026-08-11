import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CareerForm from "@/components/admin/careers/CareerForm";
import {
  careerCategories,
  careerDepartments,
  careerEmploymentTypes,
  careerWorkModes,
} from "@/lib/careers/constants";
import type { CareerContent } from "@/lib/careers/types";

function career(overrides: Partial<CareerContent> = {}): CareerContent {
  return {
    id: "career-1",
    title: "Frontend Engineer",
    slug: "frontend-engineer",
    department: "Website",
    category: "Frontend",
    location: "Remote",
    employmentType: "Full time",
    workMode: "Remote",
    experience: "3+ years",
    shortDescription: "Build polished, accessible user interfaces for product teams.",
    overview: "You will collaborate with product and engineering to deliver reliable web experiences.",
    responsibilitiesDescription: "You will own features from discovery through delivery.",
    responsibilities: ["Build accessible React interfaces."],
    requirementsDescription: "You should be comfortable working in a collaborative team.",
    requirements: ["Experience with React and TypeScript."],
    preferredQualifications: [],
    hiringProcess: [],
    featured: false,
    displayOrder: 0,
    status: "DRAFT",
    publishedAt: null,
    createdAt: new Date("2026-08-11T00:00:00.000Z"),
    updatedAt: new Date("2026-08-11T00:00:00.000Z"),
    ...overrides,
  };
}

describe("CareerForm choices", () => {
  afterEach(() => {
    document.cookie = "DevX-csrf-token=; path=/; max-age=0";
  });

  it("offers the standard choices for a new job", () => {
    render(<CareerForm mode="create" onClose={() => {}} />);

    expect(careerCategories).toEqual([
      "Sales",
      "Frontend",
      "Backend",
      "Full Stack",
      "Marketing",
      "Database",
    ]);
    expect(careerDepartments).toEqual([
      "Website",
      "Mobile App",
      "Saas",
      "Sales&Marketing",
    ]);

    const category = screen.getByLabelText("Category") as HTMLSelectElement;
    expect(category.value).toBe("");
    expect(Array.from(category.options, (option) => option.value)).toEqual([
      "",
      ...careerCategories,
    ]);

    const department = screen.getByLabelText("Department") as HTMLSelectElement;
    expect(department.value).toBe("");
    expect(Array.from(department.options, (option) => option.value)).toEqual([
      "",
      ...careerDepartments,
    ]);

    const employmentType = screen.getByLabelText("Employment type") as HTMLSelectElement;
    expect(employmentType.value).toBe("Full time");
    expect(Array.from(employmentType.options, (option) => option.value)).toEqual([
      ...careerEmploymentTypes,
    ]);

    const workMode = screen.getByLabelText("Work mode") as HTMLSelectElement;
    expect(workMode.value).toBe("");
    expect(Array.from(workMode.options, (option) => option.value)).toEqual([
      "",
      ...careerWorkModes,
    ]);

    expect((screen.getByLabelText("Experience years") as HTMLSelectElement).value).toBe("");
    expect((screen.getByLabelText("Experience months") as HTMLSelectElement).value).toBe("0");
  });

  it("keeps legacy category and department values selectable while editing", () => {
    render(
      <CareerForm
        mode="edit"
        career={career({ category: "Engineering", department: "Frontend" })}
        onClose={() => {}}
      />,
    );

    const category = screen.getByLabelText("Category") as HTMLSelectElement;
    expect(category.value).toBe("Engineering");
    expect(Array.from(category.options, (option) => option.value)).toEqual([
      "",
      "Engineering",
      ...careerCategories,
    ]);

    const department = screen.getByLabelText("Department") as HTMLSelectElement;
    expect(department.value).toBe("Frontend");
    expect(Array.from(department.options, (option) => option.value)).toEqual([
      "",
      "Frontend",
      ...careerDepartments,
    ]);
  });

  it("restores numeric experience values in the edit form", () => {
    render(
      <CareerForm
        mode="edit"
        career={career({
          employmentType: "Part time",
          workMode: "Hybrid",
          experience: "2 Years 6 Months",
        })}
        onClose={() => {}}
      />,
    );

    expect((screen.getByLabelText("Employment type") as HTMLSelectElement).value).toBe("Part time");
    expect((screen.getByLabelText("Work mode") as HTMLSelectElement).value).toBe("Hybrid");
    expect((screen.getByLabelText("Experience years") as HTMLSelectElement).value).toBe("2");
    expect((screen.getByLabelText("Experience months") as HTMLSelectElement).value).toBe("6");
  });

  it("serializes selected experience years and months when saving", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    document.cookie = "DevX-csrf-token=test-token; path=/";
    vi.stubGlobal("fetch", fetchMock);

    render(<CareerForm mode="edit" career={career({ experience: "2 Years" })} onClose={() => {}} />);

    await user.selectOptions(screen.getByLabelText("Experience years"), "3");
    await user.selectOptions(screen.getByLabelText("Experience months"), "6");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body))).toMatchObject({
      experience: "3 Years 6 Months",
    });
  });

  it("preserves older choices when an unchanged edit is saved", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    document.cookie = "DevX-csrf-token=test-token; path=/";
    vi.stubGlobal("fetch", fetchMock);

    render(
      <CareerForm
        mode="edit"
        career={career({
          category: "Engineering",
          department: "Frontend",
          employmentType: "Contract",
          workMode: "On-site",
          experience: "3+ Years",
        })}
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole("option", { name: "Current: Engineering" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Current: Frontend" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Current: Contract" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Current: On-site" })).toBeTruthy();
    expect(screen.getByText(/Current experience: 3\+ Years/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body))).toMatchObject({
      category: "Engineering",
      department: "Frontend",
      employmentType: "Contract",
      workMode: "On-site",
      experience: "3+ Years",
    });
  });
});
