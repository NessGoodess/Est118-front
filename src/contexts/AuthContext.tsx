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
import useSWR from "swr";
import { useRouter, usePathname } from "next/navigation";
import {
  login,
  logout,
  getCurrentUser,
  formatAuthError,
  authEventBus,
  AuthEvent,
  safeRedirectPath,
  markHadSession,
  clearHadSession,
  hadSessionHint,
} from "@/lib/auth";
import { ApiError } from "@/lib/types/auth";
import { User, LoginCredentials } from "@/lib/types/user";
import { disconnectEcho } from "@/lib/realtime";
import { SWR_KEYS, useClearSwrCache } from "@/lib/swr";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  /** True when a 401 means the user had a session that is no longer valid. */
  sessionExpired: boolean;
  /** The API never answered: the session is unknown, not absent. */
  connectionError: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const authenticatedRef = useRef(false);
  const clearSwrCache = useClearSwrCache();

  /**
   * Single source of truth for the session. The key is shared with the auth
   * layout, so going from /login to /dashboard reuses the cached user instead
   * of refetching it.
   */
  const {
    data: user,
    error: sessionError,
    isLoading,
    mutate: mutateUser,
  } = useSWR<User, ApiError>(SWR_KEYS.currentUser, getCurrentUser, {
    onSuccess: () => {
      setError(null);
      markHadSession();
    },
    onError: (err) => {
      // 401 on bootstrap just means "guest": PrivateGuard owns the redirect.
      setError(err.status === 401 ? null : formatAuthError(err));
    },
  });

  const authenticated = Boolean(user);

  /**
   * Server down or network lost: a 401 is the only answer that actually means
   * "no session", so guards must not sign the user out on anything else.
   */
  const connectionError =
    !user && Boolean(sessionError) && sessionError?.status !== 401;

  /**
   * While there is no cached data SWR raises `isLoading` on every retry, which
   * would strobe the guards between spinner and login screen. Gating on the
   * error keeps the spinner for the first attempt only.
   */
  const loading = (isLoading && !sessionError) || loggingOut;

  useEffect(() => {
    authenticatedRef.current = authenticated;
  }, [authenticated]);

  /** Wipes every client-side trace of the session. */
  const clearLocalSession = useCallback(async () => {
    disconnectEcho();
    clearHadSession();
    await clearSwrCache();
  }, [clearSwrCache]);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setError(null);
        setSessionExpired(false);
        await login(credentials);
        await mutateUser();

        const params =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const redirectTo = safeRedirectPath(params?.get("redirect"));
        router.replace(redirectTo ?? "/dashboard");
      } catch (err) {
        const apiError = err as ApiError;
        setError(formatAuthError(apiError));
      }
    },
    [router, mutateUser]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      setSessionExpired(false);
      await logout();
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      await clearLocalSession();
      setLoggingOut(false);
      router.replace("/login");
    }
  }, [router, clearLocalSession]);

  const refreshUser = useCallback(async () => {
    await mutateUser();
  }, [mutateUser]);

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
    const onSessionExpired = async () => {
      // Visiting /login without a session is normal — not an expiry.
      if (pathname.startsWith("/login")) {
        await mutateUser(undefined, { revalidate: false });
        return;
      }

      await mutateUser(undefined, { revalidate: false });

      const hadSession = authenticatedRef.current || hadSessionHint();
      if (!hadSession) return;

      setSessionExpired(true);

      if (authenticatedRef.current) {
        await clearLocalSession();
      }
      // PrivateGuard redirects to /login with reason + redirect.
    };

    const onForbidden = (payload?: unknown) => {
      console.warn("Forbidden access:", payload);
    };

    const onLogin = () => {
      void mutateUser();
    };

    const onLogout = () => {
      setSessionExpired(false);
      void mutateUser(undefined, { revalidate: false });
      void clearLocalSession();
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
  }, [pathname, mutateUser, clearLocalSession]);

  const value: AuthContextType = {
    user: user ?? null,
    loading,
    authenticated,
    sessionExpired,
    connectionError,
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
