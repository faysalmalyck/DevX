import { z } from "zod";

export const TEAM_MEMBER_DEPARTMENTS = [
  { value: "EXECUTIVE", label: "Executive" },
  { value: "ENGINEERING", label: "Engineering" },
  { value: "MOBILE", label: "Mobile" },
  { value: "SALES", label: "Sales" },
  { value: "MARKETING", label: "Marketing" },
] as const;

export const TEAM_MEMBER_DEPARTMENT_VALUES = TEAM_MEMBER_DEPARTMENTS.map(
  ({ value }) => value,
) as [
  (typeof TEAM_MEMBER_DEPARTMENTS)[number]["value"],
  ...(typeof TEAM_MEMBER_DEPARTMENTS)[number]["value"][],
];

export type TeamMemberDepartment = (typeof TEAM_MEMBER_DEPARTMENTS)[number]["value"];

const departmentValues = new Set<string>(TEAM_MEMBER_DEPARTMENT_VALUES);
const departmentByLabel = new Map(
  TEAM_MEMBER_DEPARTMENTS.map(({ label, value }) => [label.toLowerCase(), value]),
);

export function normalizeTeamMemberDepartment(value: unknown): TeamMemberDepartment | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!normalized) return null;
  if (departmentValues.has(normalized)) return normalized as TeamMemberDepartment;

  return departmentByLabel.get(normalized.toLowerCase()) ?? null;
}

export function teamMemberDepartmentLabel(
  department: TeamMemberDepartment | null | undefined,
) {
  return TEAM_MEMBER_DEPARTMENTS.find(({ value }) => value === department)?.label ?? null;
}

const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .nullable()
    .transform((value) => value || null);

const optionalHighlights = z.preprocess(
  (value) => value === null || value === undefined ? [] : value,
  z
    .array(
      z
        .string()
        .trim()
        .min(1, "Highlights cannot be empty.")
        .max(300, "Highlights must be 300 characters or fewer."),
    )
    .max(12, "Add no more than 12 highlights."),
);

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

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(320, "Email must be 320 characters or fewer.")
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((value) => value || null);

const blankToNull = (value: unknown) =>
  value === null || value === undefined || (typeof value === "string" && value.trim() === "")
    ? null
    : value;

const optionalDraftText = (label: string, min: number, max: number) =>
  z.preprocess(blankToNull, requiredText(label, min, max).nullable());

const optionalDraftSlug = z.preprocess(
  blankToNull,
  z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(160, "Slug must be 160 characters or fewer.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only.")
    .nullable(),
);

export const teamMemberDepartmentSchema = z.enum(TEAM_MEMBER_DEPARTMENT_VALUES);
export const teamMemberSalesRoleSchema = z.enum(["SALES_MANAGER", "SALES_AGENT"] as const);
export const teamMemberAccessRoleSchema = z.enum(["ADMINISTRATOR", "SALES_MANAGER", "SALES_AGENT"] as const);
export const teamMemberAccessChoiceSchema = z.enum(["NONE", "ADMINISTRATOR", "SALES_MANAGER", "SALES_AGENT"] as const);

const optionalDraftDepartment = z.preprocess((value) => {
  const normalized = normalizeTeamMemberDepartment(value);
  if (normalized) return normalized;
  return blankToNull(value);
}, teamMemberDepartmentSchema.nullable());

const completeRequiredText = (label: string, min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    requiredText(label, min, max),
  );

const completeSlug = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(160, "Slug must be 160 characters or fewer.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only."),
);

const completeDepartment = z.preprocess((value) => {
  if (typeof value !== "string") return "";
  return normalizeTeamMemberDepartment(value) ?? value.trim();
}, z
  .string()
  .min(1, "Department is required.")
  .refine((value) => departmentValues.has(value), "Choose a supported department."));

export const teamMemberProfileSchema = z.object({
  name: completeRequiredText("Name", 2, 160),
  slug: completeSlug,
  role: completeRequiredText("Role", 2, 160),
  department: completeDepartment,
  bio: completeRequiredText("Biography", 10, 5_000),
  image: optionalImage,
  email: optionalEmail,
  phone: optionalText(60),
  linkedinUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  twitterUrl: optionalHttpUrl,
  githubUrl: optionalHttpUrl,
});

export type TeamMemberProfileValues = z.input<typeof teamMemberProfileSchema>;

export const teamMemberStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

/**
 * A draft accepts omitted required profile fields, but it still rejects values
 * that are present and invalid. The profile status is derived separately from
 * the stricter `teamMemberProfileSchema`.
 */
const teamMemberDraftShape = {
  name: optionalDraftText("Name", 2, 160),
  slug: optionalDraftSlug,
  role: optionalDraftText("Role", 2, 160),
  department: optionalDraftDepartment,
  bio: optionalDraftText("Biography", 10, 5_000),
  about: optionalText(5_000),
  aboutParagraph2: optionalText(5_000),
  highlights: optionalHighlights,
  experience: optionalText(5_000),
  image: optionalImage,
  email: optionalEmail,
  accessRole: z.preprocess(blankToNull, teamMemberAccessChoiceSchema.nullable()).default("NONE"),
  salesRole: z.preprocess(blankToNull, teamMemberSalesRoleSchema.nullable()),
  phone: optionalText(60),
  linkedinUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  twitterUrl: optionalHttpUrl,
  githubUrl: optionalHttpUrl,
  displayOrder: z.number().int("Display order must be a whole number.").min(0, "Display order cannot be negative.").max(1_000_000, "Display order is too large.").optional().default(0),
  featured: z.boolean().optional().default(false),
  status: teamMemberStatusSchema.optional().default("DRAFT"),
};

function validateTeamMemberAccess(
  value: {
    accessRole: "NONE" | "ADMINISTRATOR" | "SALES_MANAGER" | "SALES_AGENT" | null;
    salesRole: "SALES_MANAGER" | "SALES_AGENT" | null;
    department: TeamMemberDepartment | null;
    email: string | null;
    role: string | null;
  },
  context: z.RefinementCtx,
) {
  const effectiveAccessRole = value.accessRole ?? (value.salesRole === "SALES_MANAGER" ? "SALES_MANAGER" : value.salesRole === "SALES_AGENT" ? "SALES_AGENT" : "NONE");
  if (effectiveAccessRole === "SALES_AGENT" || effectiveAccessRole === "SALES_MANAGER") {
    if (value.department !== "SALES") {
      context.addIssue({ code: "custom", path: ["department"], message: "Sales access requires the Sales department." });
    }
    if (!value.email) {
      context.addIssue({ code: "custom", path: ["email"], message: "Email is required for Sales team access." });
    }
    if (value.salesRole !== effectiveAccessRole) {
      context.addIssue({ code: "custom", path: ["salesRole"], message: "Sales Role must match the selected access role." });
    }
    if (effectiveAccessRole === "SALES_AGENT" && value.role !== "Business Development Executive") {
      context.addIssue({ code: "custom", path: ["role"], message: "Sales Agent access requires the Business Development Executive title." });
    } else if (effectiveAccessRole === "SALES_MANAGER" && value.role !== "Sales Manager") {
      context.addIssue({ code: "custom", path: ["role"], message: "Sales Manager access requires the Sales Manager title." });
    }
  } else if (value.salesRole) {
    context.addIssue({ code: "custom", path: ["salesRole"], message: "Sales Role is only available for the Sales category." });
  }
}

export const teamMemberDraftSchema = z
  .object(teamMemberDraftShape)
  .superRefine(validateTeamMemberAccess);

/**
 * Sales managers can maintain the Sales directory fields, but the richer
 * public profile content belongs to Team administrators. Explicitly reject
 * those keys while continuing to strip unrelated response-only fields (such
 * as `admin`) that the Sales editor may round-trip.
 */
const salesRestrictedProfileField = z
  .unknown()
  .optional()
  .refine(
    (value) => value === undefined,
    "Only Team administrators can edit detailed profile content.",
  );

export const teamMemberSalesSchema = z
  .object({
    ...teamMemberDraftShape,
    about: salesRestrictedProfileField,
    aboutParagraph2: salesRestrictedProfileField,
    highlights: salesRestrictedProfileField,
    experience: salesRestrictedProfileField,
  })
  .superRefine(validateTeamMemberAccess);

// Preserve the existing export name for callers while allowing incomplete
// drafts to be saved deliberately.
export const teamMemberSchema = teamMemberDraftSchema;

export type TeamMemberFormValues = z.infer<typeof teamMemberDraftSchema>;
export type TeamMemberSalesFormValues = z.infer<typeof teamMemberSalesSchema>;
