import { z } from 'zod';

// Education entry schema
export const educationSchema = z
  .object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date cannot be before start date',
      path: ['endDate'],
    },
  );

// Work experience entry schema
export const workExperienceSchema = z
  .object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date cannot be before start date',
      path: ['endDate'],
    },
  );

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Main candidate form schema
export const candidateFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  phone: z.string().max(50, 'Phone must be 50 characters or less').optional(),
  address: z
    .string()
    .max(500, 'Address must be 500 characters or less')
    .optional(),
  education: z.array(educationSchema).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
});

// Type inference from schemas
export type CandidateFormData = z.infer<typeof candidateFormSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

// Helper to validate a single field
export function validateField<T extends keyof CandidateFormData>(
  field: T,
  value: CandidateFormData[T],
): string | null {
  const fieldSchema = candidateFormSchema.shape[field];
  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message || 'Invalid value';
  }
  return null;
}

// Helper to validate the entire form
export function validateCandidateForm(
  data: CandidateFormData,
): Record<string, string> {
  const result = candidateFormSchema.safeParse(data);
  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
