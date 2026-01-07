/**
 * State for the authentication
 */
export interface AuthState {
    success: boolean;
    message: string;
    errors?: {
      email?: string[];
      password?: string[];
      general?: string[];
    };
  }
  