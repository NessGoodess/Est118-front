/**
 * SWR layer — global config, fetcher, shared cache keys and invalidation.
 */
export { SWRProvider } from "./provider";
export { swrFetcher } from "./fetcher";
export { useClearSwrCache } from "./clear-cache";
export { SWR_KEYS, SWR_PREFIX, keyPrefixFilter, type SwrPrefix } from "./keys";
export { invalidateKeyPrefix, invalidateKey } from "./invalidate";
