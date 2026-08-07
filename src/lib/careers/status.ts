import type { CareerStatus } from "@prisma/client";

export const careerStatusLabels: Record<CareerStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export function canTransitionCareerStatus(
  current: CareerStatus,
  next: CareerStatus
): boolean {
  if (current === next) return true;

  const transitions: Record<CareerStatus, CareerStatus[]> = {
    DRAFT: ["PUBLISHED", "ARCHIVED"],
    PUBLISHED: ["DRAFT", "CLOSED", "ARCHIVED"],
    CLOSED: ["ARCHIVED", "DRAFT"],
    ARCHIVED: ["DRAFT"],
  };

  return transitions[current].includes(next);
}
