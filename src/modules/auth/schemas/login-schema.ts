import { z } from 'zod';

/** Mirrors k12-api LoginDto: normalisation and limits match the backend transformers. */
export const loginSchema = z.object({
  schoolCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, 'Enter your school code')
    .min(2, 'School code is at least 2 characters')
    .max(32, 'School code is at most 32 characters')
    .regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/, 'Use letters, numbers and single hyphens only'),
  loginId: z
    .string()
    .transform((value) => value.normalize('NFKC').trim().toUpperCase())
    .pipe(
      z
        .string()
        .min(1, 'Enter your login ID')
        .max(64, 'Login ID is at most 64 characters')
        .regex(/^[A-Z0-9][A-Z0-9._@/-]*$/, 'Login ID contains characters that aren’t allowed'),
    ),
  password: z.string().min(1, 'Enter your password').max(128, 'Password is at most 128 characters'),
  rememberSchoolCode: z.boolean(),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormValues = z.output<typeof loginSchema>;
