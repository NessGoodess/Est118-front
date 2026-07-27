/**
 * API client layer — single Axios instance for Laravel Sanctum SPA.
 */
import { API_CONFIG } from './env';
import { apiClient } from './client';
import { setupRequestInterceptor, setupResponseInterceptor, } from './interceptors';

setupRequestInterceptor(apiClient, API_CONFIG.IS_DEVELOPMENT);
setupResponseInterceptor(apiClient);

export { apiClient, DEFAULT_HEADERS } from './client';
export { API_ENDPOINTS } from './endpoints';
export { handleApiError, handleAxiosError, formatError, formatAuthError, } from './errors';
export { ensureCsrfCookie } from './csrf';
export { buildApiUrl, getApiBaseUrl, getPrivateImageUrl } from './urls';
export { resetSessionExpiredFlag } from './interceptors';
export { API_CONFIG, getApiConfig } from './env';

export default apiClient;
