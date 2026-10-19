'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PasswordField } from '@/components/ui';
import type { AuthTokenResponse } from '../api/auth-api';
import { authErrorMessage } from '../auth-error-message';
import { useLogin } from '../hooks/use-auth-mutations';
import { schoolCodeStore } from '../school-code-store';
import { loginSchema, type LoginFormInput, type LoginFormValues } from '../schemas/login-schema';

const DEFAULT_VALUES: LoginFormInput = {
  schoolCode: '',
  loginId: '',
  password: '',
  rememberSchoolCode: true,
};

interface LoginFormProps {
  onSignedIn: (response: AuthTokenResponse) => void;
}

/** Central portal sign-in: school code, login ID and password. */
export function LoginForm({ onSignedIn }: LoginFormProps) {
  const login = useLogin();
  const { control, handleSubmit, setValue, getValues, setFocus } = useForm<
    LoginFormInput,
    unknown,
    LoginFormValues
  >({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    void Promise.resolve(schoolCodeStore.persist.rehydrate()).then(() => {
      const remembered = schoolCodeStore.getState().rememberedSchoolCode;
      if (remembered && !getValues('schoolCode')) {
        setValue('schoolCode', remembered);
        setFocus('loginId');
      }
    });
  }, [getValues, setValue, setFocus]);

  const onSubmit = handleSubmit(async ({ schoolCode, loginId, password, rememberSchoolCode }) => {
    let response: AuthTokenResponse;
    try {
      // mutateAsync, not mutate: signing in re-renders the page away from this form, and
      // per-call mutate callbacks don't run once the component has unmounted.
      response = await login.mutateAsync({ schoolCode, loginId, password });
    } catch {
      setValue('password', '');
      return;
    }
    const store = schoolCodeStore.getState();
    if (rememberSchoolCode) store.remember(schoolCode);
    else store.forget();
    onSignedIn(response);
  });

  return (
    <Box component="form" noValidate onSubmit={onSubmit} aria-label="Sign in">
      <Stack spacing={4}>
        {login.isError ? (
          <Alert severity="error" role="alert">
            {authErrorMessage(login.error, 'School code, login ID or password is incorrect.')}
          </Alert>
        ) : null}
        <Controller
          name="schoolCode"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <TextField
              {...field}
              inputRef={ref}
              label="School code"
              placeholder="DPSS"
              // Shown in capitals as typed; the schema upper-cases the submitted value too.
              sx={{ '& input': { textTransform: 'uppercase' } }}
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{
                htmlInput: {
                  autoCapitalize: 'characters',
                  autoComplete: 'organization',
                  spellCheck: false,
                },
              }}
            />
          )}
        />
        <Controller
          name="loginId"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <TextField
              {...field}
              inputRef={ref}
              label="Login ID"
              placeholder="20260045"
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{
                htmlInput: {
                  autoCapitalize: 'characters',
                  autoComplete: 'username',
                  spellCheck: false,
                },
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <PasswordField
              {...field}
              inputRef={ref}
              label="Password"
              required
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              slotProps={{ htmlInput: { autoComplete: 'current-password' } }}
            />
          )}
        />
        <Controller
          name="rememberSchoolCode"
          control={control}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  slotProps={{ input: { ref } }}
                  checked={value}
                  onChange={(event) => onChange(event.target.checked)}
                />
              }
              label="Remember school code on this device"
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={login.isPending}
          startIcon={login.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </Stack>
    </Box>
  );
}
