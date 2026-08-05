import apiClient, {
  handleApiError,
  API_ENDPOINTS,
  ensureCsrfCookie,
} from "@/lib/api";
import type { User } from "@/lib/types/user";
import type {
  Permission,
  RegisterUserData,
  Role,
  UserDetail,
  UserListItem,
} from "@/features/users/types/users";
import { PaginatedResponse } from "@/lib/types/paginated-response";

export type { Role, Permission };

/** Create user (admin). Optional roles/permissions; backend defaults role to `user`. */
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

export async function getUsers(params?: {
  search?: string;
  role?: string;
  verified?: boolean;
  page?: number;
}): Promise<PaginatedResponse<UserListItem>> {
  try {
    const response = await apiClient.get<PaginatedResponse<UserListItem>>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUser(id: number): Promise<UserDetail> {
  try {
    const response = await apiClient.get<{ data: UserDetail }>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

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

export async function deleteUser(id: number): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  } catch (error) {
    throw handleApiError(error);
  }
}

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

export async function resendVerification(id: number): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.USERS.RESEND_VERIFICATION(id));
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getRoles(): Promise<Role[]> {
  try {
    const response = await apiClient.get<Role[]>(API_ENDPOINTS.ROLES);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getPermissions(): Promise<Record<string, Permission[]>> {
  try {
    const response = await apiClient.get<Record<string, Permission[]>>(
      API_ENDPOINTS.PERMISSIONS
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
