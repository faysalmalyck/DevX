import { z } from "zod";

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => value || undefined);

const optionalPhone = z
  .string()
  .trim()
  .max(32)
  .refine(
    (value) => !value || /^[0-9+().\-\s]{7,32}$/.test(value),
    "Enter a valid phone number."
  )
  .optional()
  .transform((value) => value || undefined);

export const publicLeadCaptureSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(320),
    phone: optionalPhone,
    company: optionalText(160),
    message: optionalText(5000),
    budgetRange: optionalText(120),
    formType: z.enum(["CONTACT", "CONSULTATION", "PRICING"]),
  })
  .strict();

export type PublicLeadCaptureInput = z.infer<typeof publicLeadCaptureSchema>;
