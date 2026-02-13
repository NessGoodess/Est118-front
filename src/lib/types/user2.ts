/**
 * Types for users, roles and permissions
 */

/** Role as returned by admin/list/detail endpoints */
export interface RolePayload {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: unknown;
  permissions?: PermissionPayload[];
}

/** Permission as returned by admin/list/detail endpoints */
export interface PermissionPayload {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: unknown;
}

/**
 * Authenticated user (used in AuthProvider)
 * Comes from: GET /api/user
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;

  /** For auth checks */
  roles: string[];
  permissions: string[];
}

/**
 * User item in paginated list
 * Comes from: GET /api/users
 */
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  /** For display */
  role_names: string[];
  permission_names: string[];
}

/**
 * Detailed user for admin editing
 * Comes from: GET /api/users/{id}
 */
export interface UserDetail {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  roles: RolePayload[];
  permissions: PermissionPayload[];
}

/**
 * Auth forms
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
