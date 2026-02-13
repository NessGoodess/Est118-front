"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from 'next/navigation';
import { login, logout, getCurrentUser, formatAuthError } from "@/lib/auth";
import { ApiError } from "@/lib/types/auth";
import { User, LoginCredentials } from "@/lib/types/user";
import { authEventBus } from "@/lib/auth-event-bus";
import { AuthEvent } from "@/lib/auth-event";
import { clearPermissionCache } from "@/hooks/useRoutePermission";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    /**
     * Load current User
     */
    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getCurrentUser();
            setUser(userData);
            setAuthenticated(true);
        } catch (err) {
            const apiError = err as ApiError;
            //If is 401, the user is not authenticated 
            if (apiError.status === 401) {
                setUser(null);
                setAuthenticated(false);
            } else {
                setError(formatAuthError(apiError));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Login
     */
    const handleLogin = useCallback(
        async (credentials: LoginCredentials) => {
            try {
                setError(null);

                await login(credentials);
                await loadUser();
                setAuthenticated(true);

                // Redirect to dashboard after successful login
                router.replace('/dashboard');

            } catch (err) {
                const apiError = err as ApiError;
                const errorMessage = formatAuthError(apiError);
                setError(errorMessage);
                setAuthenticated(false);
                // Re-throw with formatted message so LoginForm can catch it
                throw new Error(errorMessage);
            }
        },
        [router, loadUser]
    );

    /**
     * Logout
     */
    const handleLogout = useCallback(async () => {
        try {
            setLoading(true);
            await logout();
        } catch (err) {
            console.error('Error en logout:', err);
        } finally {
            setUser(null);
            setAuthenticated(false);
            setLoading(false);

            // Limpiar cache de permisos
            clearPermissionCache();

            router.refresh();
        }
    }, [router]);

    /**
     * Refresh user
     */
    const refreshUser = useCallback(async () => {
        await loadUser();
    }, [loadUser]);

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Check if user has a specific permission
     */
    const hasPermission = useCallback((permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    }, [user]);

    /**
     * Check if user has a specific role
     */
    const hasRole = useCallback((role: string): boolean => {
        return user?.roles?.includes(role) ?? false;
    }, [user]);

    /**
     * Check if user has any of the specified permissions
     */
    const hasAnyPermission = useCallback((permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    }, [hasPermission]);

    // Load user at mount
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Listen the authentication events
    useEffect(() => {
        const onSessionExpired = () => {
            setUser(null);
            setAuthenticated(false);

        };

        const onForbidden = (payload?: unknown) => {
            // Optional: handle 403 errors if needed
            console.warn('Forbidden access:', payload);
        };

        const onLogin = () => {
            // Optional: refresh user when login event is emitted
            loadUser();
        };

        const onLogout = () => {
            // Optional: clear state locally (for tab synchronization, etc.)
            // Do not call handleLogout here to avoid loops
            setUser(null);
            setAuthenticated(false);

        };

        // Register listeners
        authEventBus.on(AuthEvent.SESSION_EXPIRED, onSessionExpired);
        authEventBus.on(AuthEvent.FORBIDDEN, onForbidden);
        authEventBus.on(AuthEvent.LOGIN, onLogin);
        authEventBus.on(AuthEvent.LOGOUT, onLogout);

        // Cleanup: remove listeners on unmount
        return () => {
            authEventBus.off(AuthEvent.SESSION_EXPIRED, onSessionExpired);
            authEventBus.off(AuthEvent.FORBIDDEN, onForbidden);
            authEventBus.off(AuthEvent.LOGIN, onLogin);
            authEventBus.off(AuthEvent.LOGOUT, onLogout);
        };
    }, [router, loadUser, handleLogout]);

    const value: AuthContextType = {
        user,
        loading,
        authenticated,
        error,
        login: handleLogin,
        logout: handleLogout,
        refreshUser,
        clearError,
        hasPermission,
        hasRole,
        hasAnyPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
