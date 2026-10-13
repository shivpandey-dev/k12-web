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

type MyMembership = Schema<'MyMembershipResponseDto'>;
type Paginated<T> = { data: T[]; meta: Schema<'PaginationMetaDto'> };

export function myMembership(overrides: Partial<MyMembership> = {}): MyMembership {
  return {
    id: 'membership-1',
    userId: '7f9c2b1e-1d4a-4c8e-9b2f-3a6d5e4c1b0a',
    schoolId: 'school-1',
    role: 'TEACHER',
    status: 'ACTIVE',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    school: { id: 'school-1', code: 'DPSS', name: 'Delhi Public School South', logoUrl: null },
    ...overrides,
  };
}

export function page<T>(data: T[], pageNumber = 1, totalPages = 1): Paginated<T> {
  return { data, meta: { page: pageNumber, limit: 100, total: data.length, totalPages } };
}
