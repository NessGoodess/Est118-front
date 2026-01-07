/**
 * Funciones de autenticación para Laravel Sanctum
 * Maneja login, logout, verificación de usuario y cookies CSRF
 */

import apiClient, { baseAxiosClient, handleApiError, formatAuthError, API_ENDPOINTS } from './config/api';
import { AuthResponse, ApiError } from './types/auth';
import { User, LoginCredentials } from './types/user';

/**
 * Obtener cookie CSRF de Laravel Sanctum
 * Debe llamarse antes de cualquier operación que requiera autenticación
 */
export async function getCsrfCookie(): Promise<void> {
  try {
    await baseAxiosClient.get(API_ENDPOINTS.AUTH.CSRF_COOKIE);
  } catch (error) {
    throw new Error('No se pudo obtener la cookie CSRF');
  }
}

/**
 * Iniciar sesión
 * Nota: /login no está bajo /api, así que usamos baseAxiosClient
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // Paso 1: Obtener cookie CSRF
    await getCsrfCookie();

    // Paso 2: Intentar login (usar baseAxiosClient porque /login no está en /api)
    const response = await baseAxiosClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email: credentials.email.trim(),
        password: credentials.password.trim(),
      }
    );

    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw apiError;
  }
}

/**
 * Cerrar sesión
 * Nota: /logout no está bajo /api
 */
export async function logout(): Promise<void> {
  try {
    await baseAxiosClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  } catch (error) {
    // Incluso si falla, continuar con el logout local
    console.error('Error en logout:', error);
    throw error;
  }
}

/**
 * Obtener usuario autenticado actual
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<{ data?: User } | User>(API_ENDPOINTS.AUTH.USER);
    
    // Laravel puede devolver { data: user } o directamente user
    const userData = 'data' in response.data ? response.data.data : response.data;
    
    if (!userData) {
      throw new Error('No se pudo obtener información del usuario');
    }
    
    return userData as User;
  } catch (error) {
    const apiError = handleApiError(error);
    throw apiError;
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
}

// Re-exportar formatAuthError desde api.ts para mantener compatibilidad
export { formatAuthError };

