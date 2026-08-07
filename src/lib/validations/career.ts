import { z } from "zod";

export const careerSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  department: z.string().min(2),
  category: z.string().optional(),
  location: z.string().min(2),
  employmentType: z.string().min(2),
  workMode: z.string().min(2),
  experience: z.string().min(2),
  shortDescription: z.string().min(10).max(180),
  overview: z.string().min(20),
  status: z.string(),
  featured: z.boolean(),
});

export type CareerFormValues = z.infer<typeof careerSchema>;