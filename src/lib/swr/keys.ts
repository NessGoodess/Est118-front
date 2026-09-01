/**
 * SWR cache keys shared across features.
 *
 * Feature-local keys live next to their hook; keep here only the ones that
 * more than one module needs to read or invalidate.
 */

export const SWR_KEYS = {
  /** Current Sanctum user. Deduped across the auth and private layouts. */
  currentUser: "auth:current-user",
} as const;
