/**
 * Centralized Axios configuration
 * Automatically handles HTTP-only cookies and XSRF tokens for Laravel Sanctum
 * 
 * This file contains:
 * - Global Axios configuration
 * - Configured Axios instances
 * - Request and response interceptors
 * - Centralized error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/auth';
import { authEventBus } from '../auth-event-bus';
import { AuthEvent } from '../auth-event';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_AXIOS_CONFIG = {
  TIMEOUT: 10000,
  WITH_CREDENTIALS: true,
  WITH_XSRF_TOKEN: true,
} as const;

// ============================================================================
// GLOBAL AXIOS CONFIGURATION
// ============================================================================

// Configure axios globally for Laravel Sanctum
axios.defaults.withCredentials = DEFAULT_AXIOS_CONFIG.WITH_CREDENTIALS;
axios.defaults.withXSRFToken = DEFAULT_AXIOS_CONFIG.WITH_XSRF_TOKEN;

// ============================================================================
// DEFAULT HEADERS
// ============================================================================

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
} as const;

// ============================================================================
// FUNCTION TO CREATE AXIOS INSTANCE
// ============================================================================

/**
 * Creates an Axios instance with custom configuration
 * @param baseURL - Base URL for requests
 * @param timeout - Timeout in milliseconds
 * @param headers - Custom headers (combined with DEFAULT_HEADERS)
 * @returns Configured Axios instance
 */
export function createAxiosInstance(
  baseURL: string,
  timeout: number = DEFAULT_AXIOS_CONFIG.TIMEOUT,
  headers: Record<string, string> = {}
): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials: DEFAULT_AXIOS_CONFIG.WITH_CREDENTIALS,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  });

  // Enable automatic XSRF token handling
  instance.defaults.withXSRFToken = DEFAULT_AXIOS_CONFIG.WITH_XSRF_TOKEN;

  return instance;
}

// ============================================================================
// INTERCEPTORS
// ============================================================================

/**
 * Configures request interceptors for development logging
 */
export function setupRequestInterceptor(
  instance: AxiosInstance,
  isDevelopment: boolean = false
): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Log requests in development
      if (isDevelopment) {
        console.log(
          `[Axios Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
}

/**
 * Configures response interceptors for error handling
 * @param instance - Axios instance
 * @param on401Callback - Function to execute when there's a 401 CSRF error (optional)
 *                        Should return void, the function handles retry automatically
 */
export function setupResponseInterceptor(
  instance: AxiosInstance,
  on401Callback?: () => Promise<void>
): void {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const status = error.response?.status;
      const message = error.response?.data?.message;

      // Handle 419 (CSRF Token Mismatch) and 403 (Forbidden by CSRF) errors
      if ((status === 419 || status === 403) && originalRequest && !originalRequest._retry) {
        // Check if it's a CSRF error
        // Note: ApiError doesn't define `error`, but some backends send it; we validate defensively.
        const maybeData = error.response?.data as unknown as { message?: string; error?: string } | undefined;
        const isCsrfError =
          message?.toLowerCase().includes('csrf') ||
          message?.toLowerCase().includes('token') ||
          maybeData?.message?.toLowerCase().includes('csrf') ||
          maybeData?.error?.toLowerCase().includes('csrf');

        if (isCsrfError && on401Callback) {
          originalRequest._retry = true;
          try {
            await on401Callback();
            // Retry the original request
            return instance(originalRequest);
          } catch {
            return Promise.reject(error);
          }
        }
      }

      // Handle 401 (Unauthenticated) errors
      if (status === 401 && originalRequest && !originalRequest._retry) {
        // If it's a CSRF error, try to get cookie and retry
        if (message?.includes('CSRF') || message?.includes('csrf')) {
          originalRequest._retry = true;

          if (on401Callback) {
            try {
              await on401Callback();
              // Retry the original request
              return instance(originalRequest);
            } catch {
              return Promise.reject(error);
            }
          }
        }

        // If it's "Unauthenticated." → session expired
        if (message === 'Unauthenticated.') {
          authEventBus.emit(AuthEvent.SESSION_EXPIRED);
          return Promise.reject(error);
        }
      }

      // Handle 403 (Forbidden) errors
      if (status === 403) {
        authEventBus.emit(AuthEvent.FORBIDDEN, error.response?.data);
      }

      return Promise.reject(error);
    }
  );
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Converts Axios errors to ApiError format
 * @param error - Unknown error to convert
 * @returns Formatted error as ApiError
 */
export function handleAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      // Server responded with an error code
      return {
        message:
          axiosError.response.data?.message || 'Error en la solicitud',
        errors: axiosError.response.data?.errors,
        status: axiosError.response.status,
      };
    } else if (axiosError.request) {
      // Request was made but no response was received
      return {
        message: 'No se pudo conectar con el servidor',
        status: 0,
      };
    }
  }

  // Unknown error
  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
  };
}

/**
 * Formats error message for display to user
 * Useful for authentication and validation errors
 * @param error - Error to format
 * @returns Formatted error message
 */
export function formatError(error: ApiError): string {
  if (error.errors) {
    // Si hay errores de validación, mostrar el primero
    const firstError = Object.values(error.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
  }
  return error.message || 'Ocurrió un error inesperado';
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export axios for direct use if needed
export { axios };
export type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

