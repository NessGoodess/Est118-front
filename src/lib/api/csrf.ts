import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

let csrfInflight: Promise<void> | null = null;

/**
 * Fetches Sanctum CSRF cookie with single-flight de-duplication.
 * Concurrent callers share the same in-flight request.
 */
export function ensureCsrfCookie(): Promise<void> {
  if (!csrfInflight) {
    csrfInflight = apiClient
      .get(API_ENDPOINTS.AUTH.CSRF_COOKIE)
      .then(() => undefined)
      .finally(() => {
        csrfInflight = null;
      });
  }

  return csrfInflight;
}
