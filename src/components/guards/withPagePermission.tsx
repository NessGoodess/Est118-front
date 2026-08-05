"use client";

import { useRoutePermission } from "@/hooks/useRoutePermission";
import { ComponentType, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface WithPermissionOptions {
  fallback?: string;
  requireAll?: string[];
  loadingComponent?: ReactNode;
}

const DefaultPageLoading = (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

/**
 * HOC that protects an entire page via `useRoutePermission` (route → Spatie permission).
 * Use for page defaults only — UI actions use feature capabilities (`canCreate`, etc.).
 *
 * @example
 * import Loading from "./loading";
 * export default withPagePermission(UsersPage, {
 *   loadingComponent: <Loading />,
 * });
 */
export function withPagePermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionOptions = {}
) {
  const {
    fallback = "/dashboard",
    requireAll = [],
    loadingComponent = DefaultPageLoading,
  } = options;

  return function PagePermissionGuard(props: P) {
    const { loading: authLoading } = useAuth();
    const { isLoading, isAuthorized } = useRoutePermission({
      fallback,
      requireAll,
    });

    if (authLoading || isLoading || !isAuthorized) {
      return <>{loadingComponent}</>;
    }

    return <WrappedComponent {...props} />;
  };
}
