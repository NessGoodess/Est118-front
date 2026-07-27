import apiClient, { handleApiError, API_ENDPOINTS, ensureCsrfCookie } from '@/lib/api';
import { RegisterUserData, User, UserDetail, UserListItem } from '../types/user';
import { PaginatedResponse } from '../types/paginated-response';

/**
 * Register a new user
 * Requires authentication and 'create users' permission
 */
export async function registerUser(userData: RegisterUserData): Promise<User> {
    try {
        await ensureCsrfCookie();

        const response = await apiClient.post<{ user: User; message: string }>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );

        return response.data.user;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Get paginated list of users with filters
 * Requires authentication and 'view users' permission
 */
export async function getUsers(params?: {
    search?: string;
    role?: string;
    verified?: boolean;
    page?: number;
}): Promise<PaginatedResponse<UserListItem>> {
    try {
        const response = await apiClient.get<PaginatedResponse<UserListItem>>(API_ENDPOINTS.USERS.LIST, { params });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Get a single user by ID
 * Requires authentication and 'view users' permission
 */
export async function getUser(id: number): Promise<UserDetail> {
    try {
        const response = await apiClient.get<{ data: UserDetail }>(API_ENDPOINTS.USERS.DETAIL(id));
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Update a user
 * Requires authentication and 'edit users' permission
 */
export async function updateUser(
    id: number,
    data: Partial<User> & { roles?: string[]; permissions?: string[] }
): Promise<User> {
    try {
        const response = await apiClient.patch<{ user: User; message: string }>(
            API_ENDPOINTS.USERS.UPDATE(id),
            data
        );
        return response.data.user;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Delete a user (soft delete)
 * Requires authentication and 'delete users' permission
 */
export async function deleteUser(id: number): Promise<void> {
    try {
        await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Change user password (admin only)
 * Requires authentication and 'edit users' permission
 */
export async function changePassword(
    id: number,
    password: string,
    password_confirmation: string
): Promise<void> {
    try {
        await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), {
            password,
            password_confirmation,
        });
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Resend email verification notification
 * Requires authentication and 'edit users' permission
 */
export async function resendVerification(id: number): Promise<void> {
    try {
        await apiClient.post(API_ENDPOINTS.USERS.RESEND_VERIFICATION(id));
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Get all roles with their permissions
 * Requires authentication
 */
export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export async function getRoles(): Promise<Role[]> {
    try {
        const response = await apiClient.get<Role[]>(API_ENDPOINTS.ROLES);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}

/**
 * Get all permissions grouped by category
 * Requires authentication
 */
export async function getPermissions(): Promise<Record<string, Permission[]>> {
    try {
        const response = await apiClient.get<Record<string, Permission[]>>(API_ENDPOINTS.PERMISSIONS);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}
