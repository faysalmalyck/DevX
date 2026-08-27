import type { Career, CareerStatus, Prisma } from "@prisma/client";

export type HiringProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type CareerContent = {
  id: string;
  title: string;
  slug: string;
  department: string;
  category: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  shortDescription: string;
  overview: string;
  responsibilitiesDescription: string;
  responsibilities: string[];
  requirementsDescription: string;
  requirements: string[];
  preferredQualifications: string[];
  hiringProcess: HiringProcessStep[];
  featured: boolean;
  displayOrder: number;
  status: CareerStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Shape consumed by the unchanged public career cards and detail sections.
 * The legacy property names intentionally keep the existing component markup
 * and public content order intact while Prisma remains the source of truth.
 */
export type PublicCareer = {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  slug: string;
  description: string;
  department: string;
  experience: string;
  workMode: string;
  overview: string;
  responsibilitiesDescription: string;
  responsibilities: string[];
  requirementsDescription: string;
  requirements: string[];
  preferredQualifications: string[];
  hiringProcess: HiringProcessStep[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function jsonStringList(
  value: Prisma.JsonValue | null | undefined
): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item !== "string") return [];

    const trimmed = item.trim();
    return trimmed ? [trimmed] : [];
  });
}

export function jsonHiringProcess(
  value: Prisma.JsonValue | null | undefined
): HiringProcessStep[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!isRecord(item)) return [];

    const title = typeof item.title === "string" ? item.title.trim() : "";
    const description =
      typeof item.description === "string" ? item.description.trim() : "";

    if (!title || !description) return [];

    return [
      {
        step: index + 1,
        title,
        description,
      },
    ];
  });
}

export function toCareerContent(career: Career): CareerContent {
  return {
    id: career.id,
    title: career.title,
    slug: career.slug,
    department: career.department,
    category: career.category ?? "",
    location: career.location,
    employmentType: career.employmentType,
    workMode: career.workMode,
    experience: career.experience,
    shortDescription: career.shortDescription,
    overview: career.overview,
    responsibilitiesDescription: career.responsibilitiesDescription,
    responsibilities: jsonStringList(career.responsibilities),
    requirementsDescription: career.requirementsDescription,
    requirements: jsonStringList(career.requirements),
    preferredQualifications: jsonStringList(career.preferredQualifications),
    hiringProcess: jsonHiringProcess(career.hiringProcess),
    featured: career.featured,
    displayOrder: career.displayOrder,
    status: career.status,
    publishedAt: career.publishedAt ? career.publishedAt.toISOString() : null,
    createdAt: career.createdAt.toISOString(),
    updatedAt: career.updatedAt.toISOString(),
  };
}

export function toPublicCareer(career: Career): PublicCareer {
  const content = toCareerContent(career);

  return {
    id: content.id,
    title: content.title,
    category: content.category || "other",
    location: content.location,
    type: content.employmentType,
    slug: content.slug,
    description: content.shortDescription,
    department: content.department,
    experience: content.experience,
    workMode: content.workMode,
    overview: content.overview,
    responsibilitiesDescription: content.responsibilitiesDescription,
    responsibilities: content.responsibilities,
    requirementsDescription: content.requirementsDescription,
    requirements: content.requirements,
    preferredQualifications: content.preferredQualifications,
    hiringProcess: content.hiringProcess,
  };
}
