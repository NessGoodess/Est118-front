/**
 * Client-side NFC status helpers.
 * Cache del API puede vivir horas; sin heartbeat reciente tratamos USB como offline.
 */
export const NFC_STATUS_MAX_AGE_MS = 90_000;

export function isNfcStatusFresh(
  timestamp: string | null | undefined,
  maxAgeMs = NFC_STATUS_MAX_AGE_MS
): boolean {
  if (!timestamp) return false;
  const t = Date.parse(timestamp);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < maxAgeMs;
}

type ReaderStatusLike = {
  timestamp?: string | null;
  connected_pcsc?: string[] | null;
  readers?: Array<
    string | { pcsc_name?: string | null; connected?: boolean }
  > | null;
};

/** PC/SC names reported live by the NFC service (empty if stale / offline). */
export function liveConnectedPcscNames(status: ReaderStatusLike): string[] {
  if (!isNfcStatusFresh(status.timestamp)) return [];

  const names = new Set<string>();
  for (const name of status.connected_pcsc ?? []) {
    if (name) names.add(name);
  }
  for (const item of status.readers ?? []) {
    if (typeof item === "string") {
      if (item) names.add(item);
    } else if (item.pcsc_name && item.connected) {
      names.add(item.pcsc_name);
    }
  }
  return Array.from(names);
}
