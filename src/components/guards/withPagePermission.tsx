'use client';

import { useRoutePermission } from '@/hooks/useRoutePermission';
import { ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WithPermissionOptions {
    fallback?: string;
    requireAll?: string[];
    loadingComponent?: React.ReactNode;
}

/**
 * Higher-Order Component para proteger páginas con permisos basados en rutas
 * 
 * @param WrappedComponent - Componente de página a proteger
 * @param options - Opciones de configuración
 * @returns Componente envuelto con verificación de permisos
 * 
 * @example
 * ```tsx
 * function UsersPage() {
 *   return <div>Users List</div>;
 * }
 * 
 * export default withPagePermission(UsersPage);
 * ```
 * 
 * @example
 * // Con opciones personalizadas
 * export default withPagePermission(AdminPage, {
 *   fallback: '/unauthorized',
 *   requireAll: ['admin', 'super-admin'],
 *   loadingComponent: <CustomLoader />
 * });
 */
export function withPagePermission<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithPermissionOptions = {}
) {
    const {
        fallback = '/dashboard',
        requireAll = [],
        loadingComponent = (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    } = options;

    return function PermissionGuardWrapper(props: P) {
        const { loading: authLoading } = useAuth();
        const { isLoading, isAuthorized } = useRoutePermission({
            fallback,
            requireAll
        });

        // Mostrar loading mientras se verifica autenticación o permisos
        if (authLoading || isLoading) {
            return <>{loadingComponent}</>;
        }

        // Si no está autorizado, no renderizar nada (el hook ya redirigió)
        if (!isAuthorized) {
            return null;
        }

        // Usuario autorizado, renderizar el componente
        return <WrappedComponent {...props} />;
    };
}
