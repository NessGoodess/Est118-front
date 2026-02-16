/**
 * Configuración centralizada de API y Axios para comunicación con Laravel Sanctum
 * Maneja automáticamente cookies HTTP-only y tokens XSRF
 * 
 * Este archivo contiene:
 * - Configuración de URLs y endpoints
 * - Instancias de Axios configuradas
 * - Interceptores y manejo de errores
 */

import { createAxiosInstance, setupRequestInterceptor, setupResponseInterceptor, handleAxiosError, formatError } from './axios.config';

// ============================================================================
// CONFIGURACIÓN DE API
// ============================================================================

// Configuración por defecto
const DEFAULT_CONFIG = {
  API_BASE_URL: 'https://api.est118.edu.mx',
  API_BASE_PATH: '/api',
  TIMEOUT: 10000,
  APP_ENV: 'production',
  APP_NAME: 'EST_118',
} as const;

// Función para obtener la configuración desde variables de entorno
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

// Configuración exportada para uso inmediato
export const API_CONFIG = getApiConfig();

// URLs específicas de endpoints
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

// Re-exportar headers desde axios.config
export { DEFAULT_HEADERS } from './axios.config';

// Función helper para construir URLs completas
export function buildApiUrl(endpoint: string, useBasePath: boolean = true): string {
  const baseUrl = useBasePath ? API_CONFIG.API_FULL_URL : API_CONFIG.API_BASE_URL;
  return `${baseUrl}${endpoint}`;
}

// Función helper para obtener la URL base sin /api
export function getApiBaseUrl(): string {
  return API_CONFIG.API_BASE_URL;
}

/** URL del endpoint de imagen privada (auth:sanctum). path = lo que devuelve el backend (ej: photos/students/1ero/A/photo.jpg). */
export function getPrivateImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  const base = getApiBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/private-image/${cleanPath}`;
}

/** URL del proxy de imágenes (same-origin). Usar en el frontend para que el navegador envíe cookies y cachee bien. */
export function getPrivateImageProxyUrl(path: string | null | undefined): string {
  if (!path) return '';
  return `/api/private-image?path=${encodeURIComponent(path)}`;
}

// ============================================================================
// CONFIGURACIÓN DE AXIOS
// ============================================================================

// Crear instancia de axios para endpoints bajo /api
const apiClient = createAxiosInstance(
  API_CONFIG.API_FULL_URL,
  API_CONFIG.TIMEOUT
);

// Crear instancia de axios para endpoints fuera de /api (login, logout, csrf-cookie)
// Estos endpoints no usan baseURL porque están en la raíz del servidor
export const baseAxiosClient = createAxiosInstance(
  API_CONFIG.API_BASE_URL, // Solo la URL base, sin /api
  API_CONFIG.TIMEOUT
);

// Configurar interceptores para apiClient
setupRequestInterceptor(apiClient, API_CONFIG.IS_DEVELOPMENT);

// Configurar interceptor de respuestas con callback para manejar 401
setupResponseInterceptor(apiClient, async () => {
  // Intentar obtener cookie CSRF si no existe
  await baseAxiosClient.get(API_ENDPOINTS.AUTH.CSRF_COOKIE);
});

// Re-exportar funciones de manejo de errores desde axios.config
export const handleApiError = handleAxiosError;
export const formatAuthError = formatError;

export default apiClient;

