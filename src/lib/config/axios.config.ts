/**
 * Configuración centralizada de Axios
 * Maneja automáticamente cookies HTTP-only y tokens XSRF para Laravel Sanctum
 * 
 * Este archivo contiene:
 * - Configuración global de Axios
 * - Instancias de Axios configuradas
 * - Interceptores de solicitudes y respuestas
 * - Manejo centralizado de errores
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/auth';
import { authEventBus } from '../auth-event-bus';
import { AuthEvent } from '../auth-event';

// ============================================================================
// CONFIGURACIÓN POR DEFECTO
// ============================================================================

const DEFAULT_AXIOS_CONFIG = {
  TIMEOUT: 10000,
  WITH_CREDENTIALS: true,
  WITH_XSRF_TOKEN: true,
} as const;

// ============================================================================
// CONFIGURACIÓN GLOBAL DE AXIOS
// ============================================================================

// Configurar axios globalmente para Laravel Sanctum
axios.defaults.withCredentials = DEFAULT_AXIOS_CONFIG.WITH_CREDENTIALS;
axios.defaults.withXSRFToken = DEFAULT_AXIOS_CONFIG.WITH_XSRF_TOKEN;

// ============================================================================
// HEADERS POR DEFECTO
// ============================================================================

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
} as const;

// ============================================================================
// FUNCIÓN PARA CREAR INSTANCIA DE AXIOS
// ============================================================================

/**
 * Crea una instancia de Axios con configuración personalizada
 * @param baseURL - URL base para las peticiones
 * @param timeout - Tiempo de espera en milisegundos
 * @param headers - Headers personalizados (se combinan con DEFAULT_HEADERS)
 * @returns Instancia de Axios configurada
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

  // Habilitar manejo automático de XSRF token
  instance.defaults.withXSRFToken = DEFAULT_AXIOS_CONFIG.WITH_XSRF_TOKEN;

  return instance;
}

// ============================================================================
// INTERCEPTORES
// ============================================================================

/**
 * Configura interceptores de solicitudes para logging en desarrollo
 */
export function setupRequestInterceptor(
  instance: AxiosInstance,
  isDevelopment: boolean = false
): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Log de solicitudes en desarrollo
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
 * Configura interceptores de respuestas para manejo de errores
 * @param instance - Instancia de Axios
 * @param on401Callback - Función a ejecutar cuando hay error 401 CSRF (opcional)
 *                        Debe retornar void, la función maneja el retry automáticamente
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

      // Manejo de errores 401 (Unauthenticated)
      if (status === 401 && originalRequest && !originalRequest._retry) {
        // Si es error de CSRF, intentar obtener cookie y retry
        if (message?.includes('CSRF') || message?.includes('csrf')) {
          originalRequest._retry = true;
          
          if (on401Callback) {
            try {
              await on401Callback();
              // Reintentar la solicitud original
              return instance(originalRequest);
            } catch (callbackError) {
              return Promise.reject(error);
            }
          }
        }
        
        // Si es "Unauthenticated." → sesión expirada
        if (message === 'Unauthenticated.') {
          authEventBus.emit(AuthEvent.SESSION_EXPIRED);
          return Promise.reject(error);
        }
      }

      // Manejo de errores 403 (Forbidden)
      if (status === 403) {
        authEventBus.emit(AuthEvent.FORBIDDEN, error.response?.data);
      }

      return Promise.reject(error);
    }
  );
}

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

/**
 * Convierte errores de Axios a formato ApiError
 * @param error - Error desconocido a convertir
 * @returns Error formateado como ApiError
 */
export function handleAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      // El servidor respondió con un código de error
      return {
        message:
          axiosError.response.data?.message || 'Error en la solicitud',
        errors: axiosError.response.data?.errors,
        status: axiosError.response.status,
      };
    } else if (axiosError.request) {
      // La solicitud se hizo pero no se recibió respuesta
      return {
        message: 'No se pudo conectar con el servidor',
        status: 0,
      };
    }
  }

  // Error desconocido
  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
  };
}

/**
 * Formatea mensaje de error para mostrar al usuario
 * Útil para errores de autenticación y validación
 * @param error - Error a formatear
 * @returns Mensaje de error formateado
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
// EXPORTACIONES
// ============================================================================

// Re-exportar axios para uso directo si es necesario
export { axios };
export type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

