import {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from '../types/auth';
import { authEventBus } from '../auth/event-bus';
import { AuthEvent } from '../auth/events';
import { ensureCsrfCookie } from './csrf';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let sessionExpiredEmitted = false;

/** Reset after a successful login so a later expiry can emit again. */
export function resetSessionExpiredFlag(): void {
  sessionExpiredEmitted = false;
}

export function setupRequestInterceptor(
  instance: AxiosInstance,
  isDevelopment = false
): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (isDevelopment) {
        console.log(
          `[Axios Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
}

/**
 * Response interceptor:
 * - 419 → refresh CSRF once and retry
 * - 401 Unauthenticated → SESSION_EXPIRED (once)
 * - 403 → FORBIDDEN (permissions), never treated as CSRF
 */
export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as RetryConfig | undefined;
      const status = error.response?.status;
      const message = error.response?.data?.message ?? '';

      // Laravel CSRF token mismatch
      if (status === 419 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await ensureCsrfCookie();
          return instance(originalRequest);
        } catch {
          return Promise.reject(error);
        }
      }

      if (status === 401) {
        const isUnauthenticated =
          message === 'Unauthenticated.' ||
          message.toLowerCase().includes('unauthenticated');

        if (isUnauthenticated && !sessionExpiredEmitted) {
          sessionExpiredEmitted = true;
          authEventBus.emit(AuthEvent.SESSION_EXPIRED);
        }

        return Promise.reject(error);
      }

      if (status === 403) {
        authEventBus.emit(AuthEvent.FORBIDDEN, error.response?.data);
      }

      return Promise.reject(error);
    }
  );
}
