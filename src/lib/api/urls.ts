import { API_CONFIG } from './env';

/** Absolute URL: API_BASE_URL + endpoint path */
export function buildApiUrl(endpoint: string): string {
  const base = API_CONFIG.API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

export function getApiBaseUrl(): string {
  return API_CONFIG.API_BASE_URL;
}

/**
 * Private image URL. Passes through absolute signed URLs; otherwise builds by id.
 */
export function getPrivateImageUrl(
  urlOrId: number | string | null | undefined,
  size: 'thumb' | 'profile' | 'original' = 'thumb'
): string {
  if (!urlOrId) return '';
  if (typeof urlOrId === 'string' && urlOrId.startsWith('http')) return urlOrId;
  return buildApiUrl(`/api/private-image/${urlOrId}?size=${size}`);
}
