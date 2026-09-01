'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { USER_PERMISSIONS } from '@/features/users/permissions';
import { STUDENT_PERMISSIONS } from '@/features/students/permissions';
import { GENERAL_ATTENDANCE_PERMISSIONS } from '@/features/general-attendance/permissions';
import { ACADEMIC_YEAR_PERMISSIONS } from '@/features/academic-years/permissions';

// Settings for route permissions
export const routePermissionMap = {
    '/users': USER_PERMISSIONS.view,
    '/users/create': USER_PERMISSIONS.create,
    '/users/[id]': USER_PERMISSIONS.view,
    '/users/[id]/edit': USER_PERMISSIONS.edit,

    '/dashboard': null,

    '/admissions': 'view pre-enrollments',
    '/admissions/applications': 'view pre-enrollments',
    '/admissions/applications/create': 'create pre-enrollments',
    '/admissions/applications/[id]': 'view pre-enrollments',
    '/admissions/applications/[id]/edit': 'edit pre-enrollments',
    '/admissions/intake-settings': 'view admission enrollment',
    '/admissions/first-grade-assignment': 'view admission enrollment',
    '/admissions/process': 'view pre-enrollments',

    '/configuracion': 'manage settings',
    '/settings': 'manage settings',

    '/students': STUDENT_PERMISSIONS.view,
    '/students/[id]': STUDENT_PERMISSIONS.view,
    '/students/credential-printing': STUDENT_PERMISSIONS.view,

    '/attendance': 'view attendance',
    '/general-attendance': GENERAL_ATTENDANCE_PERMISSIONS.view,
    '/asistencia-general': GENERAL_ATTENDANCE_PERMISSIONS.view,

    '/academic-years': ACADEMIC_YEAR_PERMISSIONS.view,

    '/groups': 'view groups',

    '/profile': null,
    '/profile/update': null,

} as const;

export type RoutePath = keyof typeof routePermissionMap;

/** Patterns compiled once: `[id]` segments match any numeric id. */
const routeMatchers: Array<{ pattern: RegExp; permission: string | null }> =
    Object.entries(routePermissionMap).map(([route, permission]) => ({
        pattern: new RegExp(`^${route.replace(/\[.*?\]/g, '\\d+')}$`),
        permission,
    }));

function findRoutePermission(pathname: string): string | null {
    return routeMatchers.find((m) => m.pattern.test(pathname))?.permission ?? null;
}

interface UseRoutePermissionOptions {
    fallback?: string;
    requireAll?: string[];
    enabled?: boolean;
}

/**
 * Resolves a route → Spatie permission decision from the already-loaded user.
 *
 * The check is synchronous: once `AuthContext` has a user, the answer is known
 * on the first render, so guarded pages don't flash a loading state on every
 * navigation. The effect only handles the redirect side-effect.
 *
 * `isAuthorized` is `null` while the decision cannot be made yet (auth still
 * loading, or no session — `PrivateGuard` owns that redirect).
 */
export function useRoutePermission(options: UseRoutePermissionOptions = {}) {
    const {
        fallback = '/dashboard',
        requireAll = [],
        enabled = true
    } = options;

    const { hasPermission, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const requiredPermission = findRoutePermission(pathname);

    let isAuthorized: boolean | null;
    if (!enabled) {
        isAuthorized = true;
    } else if (loading || !user) {
        isAuthorized = null;
    } else if (!requireAll.every((permission) => hasPermission(permission))) {
        isAuthorized = false;
    } else {
        isAuthorized = requiredPermission ? hasPermission(requiredPermission) : true;
    }

    useEffect(() => {
        if (isAuthorized === false) {
            router.replace(fallback);
        }
    }, [isAuthorized, pathname, fallback, router]);

    return {
        isLoading: loading,
        isAuthorized,
        requiredPermission,
    };
}
