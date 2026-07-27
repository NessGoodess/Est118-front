/**
 * Sanctum SPA session helpers: CSRF, login, logout, current user.
 */

import apiClient, {
  ensureCsrfCookie,
  handleApiError,
  formatAuthError,
  API_ENDPOINTS,
  resetSessionExpiredFlag,
} from '@/lib/api';
import { User, LoginCredentials } from '@/lib/types/user';

export { ensureCsrfCookie as getCsrfCookie };
export { formatAuthError };

/** Login returns 204 No Content from Laravel Breeze/Sanctum SPA. */
export async function login(credentials: LoginCredentials): Promise<void> {
  try {
    await ensureCsrfCookie();
    await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email.trim(),
      password: credentials.password,
    });
    resetSessionExpiredFlag();
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  } finally {
    resetSessionExpiredFlag();
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<{ data?: User } | User>(
      API_ENDPOINTS.AUTH.USER
    );

    const userData =
      response.data && typeof response.data === 'object' && 'data' in response.data
        ? response.data.data
        : response.data;

    if (!userData) {
      throw new Error('No se pudo obtener información del usuario');
    }

    resetSessionExpiredFlag();
    return userData as User;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function checkAuth(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
