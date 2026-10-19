import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/** Mirrors k12-api ChangePasswordDto, plus a confirmation field. */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Enter your current password')
      .max(PASSWORD_MAX_LENGTH, `Password is at most ${PASSWORD_MAX_LENGTH} characters`),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
      .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`),
    confirmPassword: z.string().min(1, 'Re-enter your new password'),
  })
  .superRefine((values, context) => {
    if (values.newPassword && values.newPassword === values.currentPassword) {
      context.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Choose a password different from your current one',
      });
    }
    if (values.confirmPassword && values.confirmPassword !== values.newPassword) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords don’t match',
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
