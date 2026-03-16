import { z } from 'zod';

const stripHtml = (val: string) => val.replace(/(<([^>]+)>)/gi, '').trim();

const sanitizedString = (min = 1, max = 255) =>
  z.string().min(min).max(max).transform(stripHtml);

const optionalSanitizedString = (max = 255) =>
  z.string().max(max).transform(stripHtml).optional();

export const EducationSchema = z.object({
  institution: sanitizedString(1, 255),
  degree: sanitizedString(1, 255),
  fieldOfStudy: optionalSanitizedString(255),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }).optional(),
});

export const WorkExperienceSchema = z.object({
  company: sanitizedString(1, 255),
  position: sanitizedString(1, 255),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }).optional(),
  description: optionalSanitizedString(2000),
});

export const CreateCandidateSchema = z.object({
  userId: z.string().uuid(),
  firstName: sanitizedString(1, 100),
  lastName: sanitizedString(1, 100),
  email: z.string().email().max(255),
  phone: optionalSanitizedString(50),
  address: optionalSanitizedString(500),
  education: z.array(EducationSchema).optional().default([]),
  workExperiences: z.array(WorkExperienceSchema).optional().default([]),
});

// Inferred TypeScript types
export type CreateCandidateInput = z.infer<typeof CreateCandidateSchema>;
export type EducationInput = z.infer<typeof EducationSchema>;
export type WorkExperienceInput = z.infer<typeof WorkExperienceSchema>;
