'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

// Settings for route permissions
export const routePermissionMap = {
    '/users': 'view users',
    '/users/create': 'create users',
    '/users/[id]': 'view users',
    '/users/[id]/edit': 'edit users',

    '/dashboard': null,

    '/admissions': 'view pre-enrollments',
    '/admissions/[id]': 'view pre-enrollments',

    '/configuracion': 'manage settings',
    '/settings': 'manage settings',

    '/students': 'view students',
    '/students/[id]': 'view students',
    '/students/credential-printing': 'view students',

    '/attendance': 'view attendance',
    '/asistencia-general': 'view general attendance',

    '/groups': 'view groups',

    '/profile': null,
    '/profile/update': null,

} as const;

export type RoutePath = keyof typeof routePermissionMap;

const permissionCache = new Map<string, boolean>();

export function clearPermissionCache() {
    permissionCache.clear();
}

interface UseRoutePermissionOptions {
    fallback?: string;
    requireAll?: string[];
    enabled?: boolean;
}

export function useRoutePermission(options: UseRoutePermissionOptions = {}) {
    const {
        fallback = '/dashboard',
        requireAll = [],
        enabled = true
    } = options;

    const { hasPermission, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const redirectAttempted = useRef(false);

    useEffect(() => {
        if (!enabled || loading) return;
        if (!user) return; 

        const checkPermission = async () => {
            let requiredPermission: string | null = null;

            for (const [route, permission] of Object.entries(routePermissionMap)) {
                const pattern = route.replace(/\[.*?\]/g, '\\d+');
                const regex = new RegExp(`^${pattern}$`);

                if (regex.test(pathname)) {
                    requiredPermission = permission;
                    break;
                }
            }

            if (requireAll.length > 0) {
                const hasAllRequired = requireAll.every(p => hasPermission(p));
                if (!hasAllRequired) {
                    setIsAuthorized(false);
                    if (!redirectAttempted.current) {
                        redirectAttempted.current = true;
                        router.push(fallback);
                    }
                    return;
                }
            }

            if (!requiredPermission) {
                setIsAuthorized(true);
                return;
            }
            const cacheKey = `${pathname}-${user.id}-${requiredPermission}`;
            if (permissionCache.has(cacheKey)) {
                const cached = permissionCache.get(cacheKey)!;
                setIsAuthorized(cached);
                if (!cached && !redirectAttempted.current) {
                    redirectAttempted.current = true;
                    router.push(fallback);
                }
                return;
            }

            const authorized = hasPermission(requiredPermission);
            permissionCache.set(cacheKey, authorized);
            setIsAuthorized(authorized);

            if (!authorized && !redirectAttempted.current) {
                redirectAttempted.current = true;
                router.push(fallback);
            }
        };

        checkPermission();
    }, [pathname, loading, hasPermission, user, router, fallback, requireAll, enabled]);

    useEffect(() => {
        redirectAttempted.current = false;
    }, [pathname]);

    return {
        isLoading: loading,
        isAuthorized,
        requiredPermission: routePermissionMap[pathname as RoutePath] || null,
    };
}
