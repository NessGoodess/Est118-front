/**
 * SWR fetchers on top of the Sanctum Axios instance.
 *
 * Keys that are plain strings are treated as API paths (see `API_ENDPOINTS`),
 * so `useSWR(API_ENDPOINTS.ROLES)` works without passing a fetcher.
 * Hooks that need params or unwrapping pass their own service function.
 */
import apiClient, { handleApiError } from "@/lib/api";

/** Laravel API Resource envelopes: `{ data: T }`. */
type MaybeEnvelope<T> = T | { data: T };

function unwrap<T>(payload: MaybeEnvelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function swrFetcher<T>(path: string): Promise<T> {
  try {
    const response = await apiClient.get<MaybeEnvelope<T>>(path);
    return unwrap<T>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
}
