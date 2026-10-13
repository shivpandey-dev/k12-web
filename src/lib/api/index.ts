export { ApiError, isApiError, type ApiErrorBody } from './api-error';
export { api, configureApiAuth, createApiClient, unwrap, type ApiAuthBridge } from './client';
export type { components, paths } from './schema';

import type { components } from './schema';
/** Shorthand for a generated k12-api schema type, e.g. `Schema<'AuthMeResponseDto'>`. */
export type Schema<Name extends keyof components['schemas']> = components['schemas'][Name];
