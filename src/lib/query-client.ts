import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/lib/api';

const MAX_RETRIES = 2;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // 4xx responses won't succeed on retry; retry only network and 5xx failures.
        retry: (failureCount, error) =>
          !(isApiError(error) && error.status < 500) && failureCount < MAX_RETRIES,
      },
      mutations: { retry: false },
    },
  });
}
