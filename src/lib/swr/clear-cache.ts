"use client";

import { useCallback } from "react";
import { useSWRConfig } from "swr";

/**
 * Drops every cached entry without revalidating.
 *
 * Call it on logout and on session expiry so the next session never renders
 * data fetched for the previous user.
 */
export function useClearSwrCache() {
  const { mutate } = useSWRConfig();

  return useCallback(
    () => mutate(() => true, undefined, { revalidate: false }),
    [mutate]
  );
}
