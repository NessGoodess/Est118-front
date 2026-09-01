"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import type { ApiError } from "@/lib/types/auth";
import { swrFetcher } from "./fetcher";

const MAX_ERROR_RETRIES = 3;
const RETRY_BASE_MS = 1000;

/**
 * Only failures that a plain retry can fix: connection lost (`status: 0` from
 * `handleApiError`), request timeout, rate limit, or a server that is
 * momentarily down while deploying.
 *
 * 401 / 403 / 419 are excluded on purpose — the Axios response interceptor owns
 * them (session expiry, forbidden, CSRF refresh + single retry). Retrying those
 * would hammer the API without ever emitting SESSION_EXPIRED again, since that
 * event is emitted only once per session.
 */
function isTransient(status: number): boolean {
  return status === 0 || status === 408 || status === 429 || status >= 500;
}

/**
 * Global SWR config.
 *
 * Mounted at the root layout so the cache survives navigation between the
 * auth and private trees (the `/api/user` request is deduped instead of
 * refetched on every route change).
 */
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
        onErrorRetry: (error, _key, _config, revalidate, opts) => {
          const status = (error as ApiError)?.status;
          if (typeof status !== "number" || !isTransient(status)) return;
          if (opts.retryCount > MAX_ERROR_RETRIES) return;

          // Exponential backoff with jitter so simultaneous hooks don't sync up.
          const backoff =
            RETRY_BASE_MS * 2 ** (opts.retryCount - 1) * (Math.random() + 0.5);
          setTimeout(() => revalidate(opts), backoff);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
