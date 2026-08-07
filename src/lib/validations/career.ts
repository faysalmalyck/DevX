import { z } from "zod";

const textField = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const bulletItem = textField("List item", 1, 700);

export const careerStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
  "ARCHIVED",
]);

export const hiringProcessStepSchema = z.object({
  title: textField("Step title", 1, 140),
  description: textField("Step description", 1, 1_200),
});

export const careerSchema = z.object({
  title: textField("Job title", 2, 160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(160, "Slug must be 160 characters or fewer.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens only."
    ),
  department: textField("Department", 1, 100),
  category: textField("Category", 1, 80),
  location: textField("Location", 1, 120),
  employmentType: textField("Employment type", 1, 80),
  workMode: textField("Work mode", 1, 80),
  experience: textField("Experience", 1, 80),
  shortDescription: textField("Card description", 10, 1_000),
  overview: textField("Job description", 10, 12_000),
  responsibilitiesDescription: z
    .string()
    .trim()
    .max(4_000, "Description paragraph must be 4,000 characters or fewer."),
  responsibilities: z
    .array(bulletItem)
    .max(40, "Add at most 40 description bullet points."),
  requirementsDescription: z
    .string()
    .trim()
    .max(4_000, "Requirements paragraph must be 4,000 characters or fewer."),
  requirements: z
    .array(bulletItem)
    .max(40, "Add at most 40 requirement bullet points."),
  preferredQualifications: z
    .array(bulletItem)
    .max(40, "Add at most 40 preferred qualifications."),
  hiringProcess: z
    .array(hiringProcessStepSchema)
    .max(20, "Add at most 20 hiring process steps."),
  featured: z.boolean(),
  displayOrder: z
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order cannot be negative.")
    .max(1_000_000, "Display order is too large."),
  status: careerStatusSchema,
});

export const careerStatusUpdateSchema = z.object({
  status: careerStatusSchema,
});

export const careerFeatureUpdateSchema = z.object({
  featured: z.boolean(),
});

export const careerOrderUpdateSchema = z.object({
  displayOrder: z
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order cannot be negative.")
    .max(1_000_000, "Display order is too large."),
});

export const careerListQuerySchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  category: z.string().trim().max(80).optional().default(""),
  status: careerStatusSchema.optional(),
  sort: z
    .enum([
      "displayOrder_asc",
      "displayOrder_desc",
      "title_asc",
      "title_desc",
      "createdAt_desc",
      "createdAt_asc",
      "updatedAt_desc",
    ])
    .optional()
    .default("displayOrder_asc"),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1),
});

export type CareerFormValues = z.infer<typeof careerSchema>;
export type CareerListQuery = z.infer<typeof careerListQuerySchema>;
