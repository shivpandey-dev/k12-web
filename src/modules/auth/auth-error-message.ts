import { isApiError } from '@/lib/api';

/**
 * A user-safe message for a failed auth request. Login failures stay generic on purpose: the API
 * never says which field was wrong, and neither do we.
 */
export function authErrorMessage(error: unknown, unauthorizedMessage: string): string {
  if (!isApiError(error)) return 'Couldn’t reach KidzDiary. Check your connection and try again.';
  if (error.status === 401) return unauthorizedMessage;
  if (error.status === 429) return 'Too many attempts. Wait a minute, then try again.';
  if (error.status === 400) return error.messages.join(' ');
  const reference = error.requestId ? ` (reference ${error.requestId})` : '';
  return `Something went wrong on our side. Try again in a moment${reference}.`;
}
