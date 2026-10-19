'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { PasswordField } from '@/components/ui';
import { isApiError } from '@/lib/api';
import { authErrorMessage } from '../auth-error-message';
import { useChangePassword } from '../hooks/use-auth-mutations';
import {
  changePasswordSchema,
  PASSWORD_MIN_LENGTH,
  type ChangePasswordFormValues,
} from '../schemas/change-password-schema';
import { PasswordRequirements } from './password-requirements';

const FIELD_ERROR_MESSAGES = {
  currentPassword: 'Current password is incorrect',
  newPassword: 'Choose a password different from your current one',
} as const;

/** Which field a server error belongs to; anything else is shown above the form. */
function fieldForError(error: unknown): keyof typeof FIELD_ERROR_MESSAGES | null {
  if (!isApiError(error)) return null;
  if (error.status === 401 && /current password/i.test(error.message)) return 'currentPassword';
  if (error.status === 400 && /differ/i.test(error.message)) return 'newPassword';
  return null;
}

const DEFAULT_VALUES: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

interface ChangePasswordFormProps {
  onChanged: () => void;
  /** Extra buttons next to submit, e.g. Cancel. */
  secondaryAction?: ReactNode;
  currentPasswordLabel?: string;
}

export function ChangePasswordForm({
  onChanged,
  secondaryAction,
  currentPasswordLabel = 'Current password',
}: ChangePasswordFormProps) {
  const changePassword = useChangePassword();
  const { control, handleSubmit, setError } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [newPassword, confirmPassword] = useWatch({
    control,
    name: ['newPassword', 'confirmPassword'],
  });

  const onSubmit = handleSubmit(({ currentPassword, newPassword: password }) => {
    changePassword.mutate(
      { currentPassword, newPassword: password },
      {
        onSuccess: onChanged,
        onError: (error) => {
          const field = fieldForError(error);
          if (field)
            setError(field, { message: FIELD_ERROR_MESSAGES[field] }, { shouldFocus: true });
        },
      },
    );
  });

  const formError =
    changePassword.isError && !fieldForError(changePassword.error)
      ? authErrorMessage(changePassword.error, 'Your session ended. Sign in again.')
      : null;

  return (
    <Box component="form" noValidate onSubmit={onSubmit} aria-label="Change password">
      <Stack spacing={4}>
        {formError ? (
          <Alert severity="error" role="alert">
            {formError}
          </Alert>
        ) : null}
        <Controller
          name="currentPassword"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <PasswordField
              {...field}
              inputRef={ref}
              label={currentPasswordLabel}
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{ htmlInput: { autoComplete: 'current-password' } }}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <PasswordField
              {...field}
              inputRef={ref}
              label="New password"
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <PasswordField
              {...field}
              inputRef={ref}
              label="Confirm new password"
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
            />
          )}
        />
        <PasswordRequirements
          requirements={[
            {
              label: `At least ${PASSWORD_MIN_LENGTH} characters`,
              isMet: newPassword.length >= PASSWORD_MIN_LENGTH,
            },
            {
              label: 'Matches the confirmation',
              isMet: newPassword.length > 0 && newPassword === confirmPassword,
            },
          ]}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {secondaryAction}
          <Button
            type="submit"
            variant="contained"
            disabled={changePassword.isPending}
            startIcon={
              changePassword.isPending ? <CircularProgress size={16} color="inherit" /> : undefined
            }
          >
            {changePassword.isPending ? 'Saving…' : 'Change password'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
