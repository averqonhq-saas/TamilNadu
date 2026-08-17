import { z } from "zod";

export const IdeaSubmissionSchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  problem_option: z.string().min(1, "Please select a problem"),
  problem_custom: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  solution_description: z.string().max(2000).optional(),
  district: z.string().min(1, "Please select your district"),
  name: z.string().max(100).optional(),
  email: z.string().email("Please enter a valid email address"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive updates",
  }),
});

export type IdeaSubmissionInput = z.infer<typeof IdeaSubmissionSchema>;

export const IdeaFilterSchema = z.object({
  category: z.string().optional(),
  district: z.string().optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type IdeaFilterInput = z.infer<typeof IdeaFilterSchema>;

export const AdminIdeaUpdateSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "PUBLIC",
    "DUPLICATE",
    "REJECTED",
    "SHORTLISTED",
    "SELECTED",
    "BUILDING",
    "COMPLETED",
  ]).optional(),
  visibility: z.enum(["PRIVATE", "PUBLIC", "HIDDEN"]).optional(),
  admin_notes: z.string().max(2000).optional(),
  similarity_group_id: z.string().uuid().nullable().optional(),
});

export type AdminIdeaUpdateInput = z.infer<typeof AdminIdeaUpdateSchema>;
