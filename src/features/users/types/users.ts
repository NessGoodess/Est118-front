/** Role/permission payloads from admin detail API */
export interface RolePayload {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: unknown;
  permissions?: PermissionPayload[];
}

export interface PermissionPayload {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: unknown;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

/** Paginated list item — GET /api/users */
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  role_names: string[];
  permission_names: string[];
}

/** Admin detail — GET /api/users/{id} */
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

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles?: string[];
  permissions?: string[];
}
