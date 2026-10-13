import type { components } from './schema';

export type ApiErrorBody = components['schemas']['ApiErrorResponseDto'];

/** A failed k12-api call, normalized from the API's error shape or a transport failure. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;
  readonly requestId: string | null;

  constructor(status: number, body: ApiErrorBody | null, requestId: string | null = null) {
    super(describe(status, body));
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.requestId = requestId ?? body?.requestId ?? null;
  }

  /** Validation messages as a list (the API sends a string or a string array). */
  get messages(): string[] {
    const message = this.body?.message;
    if (message === undefined) return [this.message];
    return Array.isArray(message) ? message : [message];
  }
}

function describe(status: number, body: ApiErrorBody | null): string {
  if (body === null) return `Request failed with status ${status}`;
  return Array.isArray(body.message) ? body.message.join(', ') : body.message;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    'message' in value &&
    'requestId' in value
  );
}

/** Builds an ApiError from an openapi-fetch `error` value and its response. */
export function toApiError(error: unknown, response: Response): ApiError {
  return new ApiError(
    response.status,
    isApiErrorBody(error) ? error : null,
    response.headers.get('x-request-id'),
  );
}
