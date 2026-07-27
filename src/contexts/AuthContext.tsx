"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  login,
  logout,
  getCurrentUser,
  formatAuthError,
  authEventBus,
  AuthEvent,
} from "@/lib/auth";
import { ApiError } from "@/lib/types/auth";
import { User, LoginCredentials } from "@/lib/types/user";
import { clearPermissionCache } from "@/hooks/useRoutePermission";
import { disconnectEcho } from "@/lib/realtime";
import { globalToast } from "@/lib/toast";

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

function clearLocalSession() {
  clearPermissionCache();
  disconnectEcho();
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const authenticatedRef = useRef(false);
  const handlingExpiryRef = useRef(false);

  useEffect(() => {
    authenticatedRef.current = authenticated;
  }, [authenticated]);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
      setAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;
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

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setError(null);
        await login(credentials);
        await loadUser();
        setAuthenticated(true);

        const params =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const redirectTo = params?.get("redirect");
        router.replace(
          redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/dashboard"
        );
      } catch (err) {
        const apiError = err as ApiError;
        setError(formatAuthError(apiError));
        setAuthenticated(false);
      }
    },
    [router, loadUser]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
      clearLocalSession();
      router.replace("/login");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return user?.permissions?.includes(permission) ?? false;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.roles?.includes(role) ?? false;
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission]
  );

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const onSessionExpired = () => {
      // Guest bootstrap /api/user 401 — clear quietly, no toast/redirect
      if (!authenticatedRef.current) {
        setUser(null);
        setAuthenticated(false);
        return;
      }

      if (handlingExpiryRef.current) return;
      handlingExpiryRef.current = true;

      setUser(null);
      setAuthenticated(false);
      clearLocalSession();

      globalToast.warning(
        "Sesión expirada",
        "Tu sesión ha caducado. Inicia sesión de nuevo."
      );

      const current =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : pathname || "/dashboard";

      if (!current.startsWith("/login")) {
        const redirect = encodeURIComponent(current);
        router.replace(`/login?reason=expired&redirect=${redirect}`);
      }

      handlingExpiryRef.current = false;
    };

    const onForbidden = (payload?: unknown) => {
      console.warn("Forbidden access:", payload);
    };

    const onLogin = () => {
      loadUser();
    };

    const onLogout = () => {
      setUser(null);
      setAuthenticated(false);
      clearLocalSession();
    };

    authEventBus.on(AuthEvent.SESSION_EXPIRED, onSessionExpired);
    authEventBus.on(AuthEvent.FORBIDDEN, onForbidden);
    authEventBus.on(AuthEvent.LOGIN, onLogin);
    authEventBus.on(AuthEvent.LOGOUT, onLogout);

    return () => {
      authEventBus.off(AuthEvent.SESSION_EXPIRED, onSessionExpired);
      authEventBus.off(AuthEvent.FORBIDDEN, onForbidden);
      authEventBus.off(AuthEvent.LOGIN, onLogin);
      authEventBus.off(AuthEvent.LOGOUT, onLogout);
    };
  }, [router, loadUser, pathname]);

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
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
