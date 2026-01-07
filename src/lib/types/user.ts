/**
 * 
 * Types for the user
 */

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }