"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { login, logout, getCurrentUser, formatAuthError } from "@/lib/auth";
import { ApiError } from "@/lib/types/auth";
import { User, LoginCredentials } from "@/lib/types/user";
import { authEventBus } from "@/lib/auth-event-bus";
import { AuthEvent } from "@/lib/auth-event";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
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
    const pathname = usePathname();

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
            // Si es 401, el usuario no está autenticado (esto es normal)
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
                setLoading(true);
                setError(null);
                const response = await login(credentials);
                setUser(response.user || (response as unknown as User));
                setAuthenticated(true);

                // Pequeño delay para asegurar que las cookies se establezcan completamente
                await new Promise(resolve => setTimeout(resolve, 100));

                // Redirigir al dashboard después de login exitoso
                router.push('/dashboard');
                router.refresh();
            } catch (err) {
                const apiError = err as ApiError;
                setError(formatAuthError(apiError));
                setAuthenticated(false);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [router]
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
            router.push('/login');
            router.refresh();
        }
    }, [router]);

    /**
     * Actualizar información del usuario
     */
    const refreshUser = useCallback(async () => {
        await loadUser();
    }, [loadUser]);

    /**
     * Limpiar errores
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Cargar usuario al montar el componente
    useEffect(() => {
        // Solo verificar autenticación si no estamos en la página de login
        if (pathname !== '/login') {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [pathname, loadUser]);

    // Escuchar eventos de autenticación del Event Bus
    useEffect(() => {
        const onSessionExpired = () => {
            setUser(null);
            setAuthenticated(false);
            router.push('/login');
        };

        const onForbidden = (payload?: unknown) => {
            // Opcional: manejar errores 403 si es necesario
            console.warn('Forbidden access:', payload);
        };

        const onLogin = () => {
            // Opcional: refrescar usuario cuando se emite evento de login
            loadUser();
        };

        const onLogout = () => {
            // Solo limpiar estado local (para sincronización entre tabs, etc.)
            // No llamar handleLogout aquí para evitar loops
            setUser(null);
            setAuthenticated(false);
            router.push('/login');
        };

        // Registrar listeners
        authEventBus.on(AuthEvent.SESSION_EXPIRED, onSessionExpired);
        authEventBus.on(AuthEvent.FORBIDDEN, onForbidden);
        authEventBus.on(AuthEvent.LOGIN, onLogin);
        authEventBus.on(AuthEvent.LOGOUT, onLogout);

        // Cleanup: remover listeners al desmontar
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
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
