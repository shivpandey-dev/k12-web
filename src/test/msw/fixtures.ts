import type { Schema } from '@/lib/api';

type AuthTokenResponse = Schema<'AuthTokenResponseDto'>;
type ApiErrorBody = Schema<'ApiErrorResponseDto'>;

export function authTokenResponse(overrides: Partial<AuthTokenResponse> = {}): AuthTokenResponse {
  return {
    accessToken: 'access-1',
    tokenType: 'Bearer',
    expiresIn: 900,
    user: {
      id: '7f9c2b1e-1d4a-4c8e-9b2f-3a6d5e4c1b0a',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: null,
      phone: null,
    },
    credential: {
      loginId: '20260045',
      schoolId: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
      mustChangePassword: false,
    },
    ...overrides,
  };
}

export function apiErrorBody(statusCode: number, message: string | string[]): ApiErrorBody {
  return {
    statusCode,
    error: 'Error',
    message,
    path: '/api/v1/test',
    requestId: 'req-test-1',
    timestamp: '2026-10-13T00:00:00.000Z',
  };
}
