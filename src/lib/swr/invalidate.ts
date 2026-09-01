// The global `mutate` only exists in SWR's client build, so this module has to
// stay on the client side of the graph even when a server layout re-exports it.
"use client";

/**
 * Cache invalidation callable from outside React.
 *
 * `SWRProvider` does not set a custom cache provider, so the global `mutate`
 * exported by SWR targets the same cache the hooks read from.
 */
import { mutate, type Arguments } from "swr";
import { keyPrefixFilter, type SwrPrefix } from "./keys";

/** Revalidates every mounted hook whose key starts with `prefix`. */
export function invalidateKeyPrefix(prefix: SwrPrefix) {
  return mutate(keyPrefixFilter(prefix));
}

/** Revalidates one exact key. */
export function invalidateKey(key: Arguments) {
  return mutate(key);
}
