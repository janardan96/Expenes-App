import { z } from 'zod';

/**
 * Profile setup collected on the login screen. The schema is the single source
 * of truth for both validation and the form's TypeScript types.
 */
export const loginSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less')
    .regex(
      /^[a-zA-Z\s.'-]+$/,
      "Use letters, spaces, apostrophes or hyphens only",
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(120, 'Email is too long')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email address'),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Enter a 10-digit mobile number'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
