'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PermissionGuardProps {
    permission: string | string[];
    fallback?: ReactNode;
    requireAll?: boolean;
    children: ReactNode;
    redirectTo?: string; // Nueva opción para redirección automática
}

/**
 * PermissionGuard component
 * Conditionally renders children based on user permissions
 * 
 * @param permission - Single permission or array of permissions to check
 * @param fallback - Optional fallback content to render if user lacks permission
 * @param requireAll - If true, user must have all permissions. If false, user needs any one permission
 * @param children - Content to render if user has required permissions
 * @param redirectTo - Optional path to redirect if user lacks permission (instead of showing fallback)
 */
export function PermissionGuard({
    permission,
    fallback = null,
    requireAll = false,
    children,
    redirectTo,
}: PermissionGuardProps) {
    const { hasPermission, hasAnyPermission, loading, authenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && authenticated && redirectTo) {
            const permissions = Array.isArray(permission) ? permission : [permission];
            const hasAccess = requireAll
                ? permissions.every(p => hasPermission(p))
                : hasAnyPermission(permissions);

            if (!hasAccess) {
                router.push(redirectTo);
            }
        }
    }, [loading, authenticated, hasPermission, hasAnyPermission, permission, requireAll, redirectTo, router]);

    if (loading) {
        return null;
    }

    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
        ? permissions.every(p => hasPermission(p))
        : hasAnyPermission(permissions);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
}
