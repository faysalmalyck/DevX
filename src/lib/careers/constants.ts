export const publicCareerCategories = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "Sales", label: "Sales" },
  { id: "other", label: "Other" },
] as const;

export type PublicCareerCategory = (typeof publicCareerCategories)[number]["id"];

export function getPublicCareerCategory(
  value: string | undefined
): PublicCareerCategory {
  return publicCareerCategories.some((category) => category.id === value)
    ? (value as PublicCareerCategory)
    : "all";
}
