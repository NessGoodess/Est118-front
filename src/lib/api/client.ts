import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './env';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
} as const;

/**
 * Single Axios instance for Laravel Sanctum SPA auth.
 * baseURL is the API origin (no /api). Paths in endpoints include /api when needed.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  withXSRFToken: true,
  headers: { ...DEFAULT_HEADERS },
});

export default apiClient;
