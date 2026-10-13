import { api, unwrap, type Schema } from '@/lib/api';

export type AuthTokenResponse = Schema<'AuthTokenResponseDto'>;
export type AuthMe = Schema<'AuthMeResponseDto'>;
export type LoginRequest = Schema<'LoginDto'>;
export type TenantLoginRequest = Schema<'TenantLoginDto'>;
export type ChangePasswordRequest = Schema<'ChangePasswordDto'>;

export const authApi = {
  /** Central portal login: School code + login ID. */
  login: (body: LoginRequest) => unwrap(api.POST('/api/v1/auth/login', { body })),

  /** Login on a School hostname; the API resolves the School from the forwarded host. */
  tenantLogin: (body: TenantLoginRequest) =>
    unwrap(api.POST('/api/v1/auth/tenant-login', { body })),

  /** Rotates the HttpOnly refresh cookie and returns a new access token. */
  refresh: () => unwrap(api.POST('/api/v1/auth/refresh')),

  me: () => unwrap(api.GET('/api/v1/auth/me')),

  changePassword: (body: ChangePasswordRequest) =>
    unwrap(api.POST('/api/v1/auth/change-password', { body })),

  logout: () => unwrap(api.POST('/api/v1/auth/logout')),

  logoutAll: () => unwrap(api.POST('/api/v1/auth/logout-all')),
};
