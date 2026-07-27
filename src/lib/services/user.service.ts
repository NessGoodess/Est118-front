
import apiClient, { handleApiError, API_ENDPOINTS } from '@/lib/api';

/**
 * Resend email verification notification
 * Requires authentication and 'edit users' permission
 */
export async function mailVerification(): Promise<{ message: string }> {
    try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFICATION);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Change own password (current user). Requires current_password for security.
 * Backend should accept: current_password, password, password_confirmation
 */
export async function changeOwnPassword(
    current_password: string,
    password: string,
    password_confirmation: string
): Promise<void> {
    try {
        await apiClient.post(API_ENDPOINTS.CURRENT_USER.CHANGE_PASSWORD, {
            current_password,
            password,
            password_confirmation,
        });
    } catch (error) {
        throw handleApiError(error);
    }
}