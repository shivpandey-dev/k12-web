'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  type ChangePasswordRequest,
  type LoginRequest,
  type TenantLoginRequest,
} from '../api/auth-api';
import { clearSession, markPasswordChanged, startSession, updateIdentity } from '../session-store';

/** Central portal login (School code + login ID). */
export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginRequest) => authApi.login(input),
    onSuccess: startSession,
  });
}

/** Login on a School hostname (login ID only). */
export function useTenantLogin() {
  return useMutation({
    mutationFn: (input: TenantLoginRequest) => authApi.tenantLogin(input),
    onSuccess: startSession,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordRequest) => authApi.changePassword(input),
    // The password is already changed; refreshing the identity is best effort.
    onSuccess: async () => {
      try {
        updateIdentity(await authApi.me());
      } catch {
        markPasswordChanged();
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scope: 'current' | 'all' = 'current') =>
      scope === 'all' ? authApi.logoutAll() : authApi.logout(),
    // Always drop local state, even when the server call fails.
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
