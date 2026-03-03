/**
 * API configuration
 * Centralized API and Axios configuration for communication with Laravel Sanctum
 * Automatically handles HTTP-only cookies and XSRF tokens
 * 
 * This file contains:
 * - URL and endpoint configuration
 * - Axios instances configuration
 * - Request and response interceptors
 */

import { createAxiosInstance, setupRequestInterceptor, setupResponseInterceptor, handleAxiosError, formatError } from './axios.config';

// ============================================================================
// API CONFIGURATION
// ============================================================================

// Default configuration
const DEFAULT_CONFIG = {
  API_BASE_URL: 'https://api.est118.edu.mx',
  API_BASE_PATH: '/api',
  TIMEOUT: 10000,
  APP_ENV: 'production',
  APP_NAME: 'EST_118',
} as const;

// Function to get configuration from environment variables
export function getApiConfig() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_CONFIG.API_BASE_URL;
  const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH || DEFAULT_CONFIG.API_BASE_PATH;
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || DEFAULT_CONFIG.APP_ENV;
  const appName = process.env.NEXT_PUBLIC_APP_NAME || DEFAULT_CONFIG.APP_NAME;
  const timeout = parseInt(
    process.env.NEXT_PUBLIC_API_TIMEOUT || DEFAULT_CONFIG.TIMEOUT.toString(),
    10
  );

  return {
    API_BASE_URL: apiBaseUrl,
    API_BASE_PATH: apiBasePath,
    API_FULL_URL: `${apiBaseUrl}${apiBasePath}`,
    TIMEOUT: timeout,
    APP_ENV: appEnv,
    APP_NAME: appName,
    IS_DEVELOPMENT: appEnv === 'development',
    IS_PRODUCTION: appEnv === 'production',
  };
}

// Exported configuration for immediate use
export const API_CONFIG = getApiConfig();

// URLs of endpoints
export const API_ENDPOINTS = {
  AUTH: {
    CSRF_COOKIE: '/sanctum/csrf-cookie',
    LOGIN: '/login',
    LOGOUT: '/logout',
    USER: '/user',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFICATION: '/email/verification-notification',
  },
  CURRENT_USER: {
    CHANGE_PASSWORD: '/current-user/change-password',
  },

  SCHEDULES: '/schedules',
  ATTENDANCE: {
    RECORD: '/record',
    CURRENT_STUDENT: '/attendance/last-attendance',
    HISTORY: '/attendance/all-attendances',
    RECENT_READINGS: '/attendance/recent-readings',
  },
  READER: {
    STATUS: '/reader/status',
  },
  CLASS_STUDENTS: (scheduleId: number, date: string) => `/class/${scheduleId}/date/${date}`,
  STUDENTS: '/students',
  ALL_STUDENTS: '/all-students',
  GRADES: '/students/grades',
  STUDENTS_BY_GRADE: (grade_id: number) => `/students/grades/${grade_id}`,

  ADMISSION: {
    PRE_ENROLLMENT: 'admissions/pre-enrollment',
    CYCLES: 'admissions/cycles',
    CYCLE_ACTIVATE: (id: number) => `admissions/cycles/${id}/activate`,
    CYCLE_CLOSE: (id: number) => `admissions/cycles/${id}/close`,
    CYCLE_REOPEN: (id: number) => `admissions/cycles/${id}/reopen`,
    CYCLE_DELETE: (id: number) => `admissions/cycles/${id}`,
    STATUS: 'admissions/status',

    PRE_ENROLLMENTS: 'admissions/pre-enrollments',
    PRE_ENROLLMENT_EXPORT: 'admissions/pre-enrollments/export',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    CHANGE_PASSWORD: (id: number) => `/users/${id}/change-password`,
    RESEND_VERIFICATION: (id: number) => `/users/${id}/resend-verification`,
  },
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
} as const;

// Re-export headers from axios.config
export { DEFAULT_HEADERS } from './axios.config';

// Helper function to build full URLs
export function buildApiUrl(endpoint: string, useBasePath: boolean = true): string {
  const baseUrl = useBasePath ? API_CONFIG.API_FULL_URL : API_CONFIG.API_BASE_URL;
  return `${baseUrl}${endpoint}`;
}

// Helper function to get the base URL without /api
export function getApiBaseUrl(): string {
  return API_CONFIG.API_BASE_URL;
}

/** URL of the private image endpoint (auth:sanctum). path = what the backend returns (e.g: photos/students/1ero/A/photo.jpg). */
export function getPrivateImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  const base = getApiBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/api/private-image/${cleanPath}`;
}

/** URL of the private image proxy (same-origin). Use in the frontend to make the browser send cookies and cache well. */
export function getPrivateImageProxyUrl(path: string | null | undefined): string {
  if (!path) return '';
  return `/api/private-image?path=${encodeURIComponent(path)}`;
}

// ============================================================================
// AXIOS CONFIGURATION
// ============================================================================

// Create axios instance for endpoints under /api
const apiClient = createAxiosInstance(
  API_CONFIG.API_FULL_URL,
  API_CONFIG.TIMEOUT
);

// Create axios instance for endpoints outside of /api (login, logout, csrf-cookie)
// These endpoints do not use baseURL because they are at the root of the server
export const baseAxiosClient = createAxiosInstance(
  API_CONFIG.API_BASE_URL, // Only the base URL, without /api
  API_CONFIG.TIMEOUT
);

// Configure interceptors for apiClient
setupRequestInterceptor(apiClient, API_CONFIG.IS_DEVELOPMENT);

// Configure response interceptor with callback to handle 401
setupResponseInterceptor(apiClient, async () => {
  // Try to obtain CSRF cookie if it doesn't exist
  await baseAxiosClient.get(API_ENDPOINTS.AUTH.CSRF_COOKIE);
});

// Re-export functions from axios.config
export const handleApiError = handleAxiosError;
export const formatAuthError = formatError;

export default apiClient;

