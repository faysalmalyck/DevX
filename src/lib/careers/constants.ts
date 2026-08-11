export const publicCareerCategories = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "Sales", label: "Sales" },
  { id: "other", label: "Other" },
] as const;

export const careerCategories = [
  "Sales",
  "Frontend",
  "Backend",
  "Full Stack",
  "Marketing",
  "Database",
] as const;

export type CareerCategory = (typeof careerCategories)[number];

export const careerDepartments = [
  "Website",
  "Mobile App",
  "Saas",
  "Sales&Marketing",
] as const;

export type CareerDepartment = (typeof careerDepartments)[number];

export const careerEmploymentTypes = ["Part time", "Full time"] as const;

export const careerWorkModes = ["Onsite", "Hybrid", "Remote"] as const;

export const careerExperienceYears = Array.from({ length: 61 }, (_, year) => year);

export const careerExperienceMonths = Array.from({ length: 12 }, (_, month) => month);

export type CareerExperience = {
  years: number;
  months: number;
};

export function formatCareerExperience({
  years,
  months,
}: CareerExperience): string {
  const yearLabel = years === 1 ? "Year" : "Years";
  if (months === 0) return `${years} ${yearLabel}`;

  const monthLabel = months === 1 ? "Month" : "Months";
  return `${years} ${yearLabel} ${months} ${monthLabel}`;
}

export function parseCareerExperience(value: string): CareerExperience | null {
  const match = value
    .trim()
    .match(/^(\d+)\s+years?(?:\s*(?:,|and)?\s*(\d+)\s+months?)?$/i);
  if (!match) return null;

  const years = Number(match[1]);
  const months = Number(match[2] ?? 0);
  if (
    !Number.isInteger(years) ||
    !Number.isInteger(months) ||
    years < 0 ||
    years > 60 ||
    months < 0 ||
    months > 11
  ) {
    return null;
  }

  return { years, months };
}

export type PublicCareerCategory = (typeof publicCareerCategories)[number]["id"];

export function getPublicCareerCategory(
  value: string | undefined
): PublicCareerCategory {
  return publicCareerCategories.some((category) => category.id === value)
    ? (value as PublicCareerCategory)
    : "all";
}
