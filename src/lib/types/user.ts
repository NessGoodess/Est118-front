/**
 * Auth session user types (AuthContext / login).
 * Admin CRUD types live in `@/features/users`.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}
