import { z } from "zod";

const requiredText = (label: string, min: number, max: number) =>
  z.string().trim().min(min, `${label} is required.`).max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional().nullable().transform((value) => value || null);

const optionalHttpUrl = z
  .string()
  .trim()
  .max(2_000, "URL must be 2,000 characters or fewer.")
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a valid HTTP(S) URL.")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((value) => value || null);

const optionalImage = z
  .string()
  .trim()
  .max(2_000, "Image source must be 2,000 characters or fewer.")
  .refine((value) => {
    if (value === "") return true;
    if (value.startsWith("/") && !value.startsWith("//")) return true;

    try {
      const { protocol } = new URL(value);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "Use a site-relative path or a valid HTTP(S) URL.")
  .optional()
  .nullable()
  .transform((value) => value || null);

export const teamMemberStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const teamMemberSchema = z.object({
  name: requiredText("Name", 2, 160),
  slug: z.string().trim().min(2, "Slug is required.").max(160, "Slug must be 160 characters or fewer.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only."),
  role: requiredText("Role", 2, 160),
  department: requiredText("Department", 2, 100),
  bio: requiredText("Biography", 10, 5_000),
  image: optionalImage,
  email: z.string().trim().email("Enter a valid email address.").max(320, "Email must be 320 characters or fewer.").optional().nullable().or(z.literal("")).transform((value) => value || null),
  phone: optionalText(60),
  linkedinUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  twitterUrl: optionalHttpUrl,
  githubUrl: optionalHttpUrl,
  displayOrder: z.number().int("Display order must be a whole number.").min(0, "Display order cannot be negative.").max(1_000_000, "Display order is too large."),
  featured: z.boolean(),
  status: teamMemberStatusSchema,
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;
