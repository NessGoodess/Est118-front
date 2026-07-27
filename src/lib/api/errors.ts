import axios, { AxiosError } from 'axios';
import { ApiError } from '../types/auth';

/**
 * Converts Axios / unknown errors into a stable ApiError shape.
 */
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const rawMessage = axiosError.response.data?.message;

      return {
        message: userFacingMessage(status, rawMessage),
        errors: axiosError.response.data?.errors,
        status,
      };
    }

    if (axiosError.request) {
      return {
        message: 'No se pudo conectar con el servidor',
        status: 0,
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
  };
}

/** Map technical Laravel/API messages to UI-safe copy. */
function userFacingMessage(status: number, raw?: string): string {
  if (status === 419) {
    return 'La sesión de seguridad expiró. Recarga la página e inténtalo de nuevo.';
  }

  if (
    raw &&
    /csrf|token mismatch/i.test(raw)
  ) {
    return 'La sesión de seguridad expiró. Recarga la página e inténtalo de nuevo.';
  }

  if (status >= 500) {
    return 'Error en el servidor. Inténtalo de nuevo más tarde.';
  }

  return raw || 'Error en la solicitud';
}

/** Alias kept for older call sites */
export const handleAxiosError = handleApiError;

/**
 * Formats an ApiError for UI display (validation → first field message).
 */
export function formatError(error: ApiError): string {
  if (error.errors) {
    const firstError = Object.values(error.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
  }
  return error.message || 'Ocurrió un error inesperado';
}

/** Alias for auth forms */
export const formatAuthError = formatError;
