'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const PERFIL_EDITAR_PATH = '/profile/update';

/**
 * PrivateGuard - Protects private routes from unauthenticated users.
 * If user is authenticated but email is not verified, only /profile/update is allowed (and /profile/*).
 */
export default function PrivateGuard({ children }: { children: React.ReactNode }) {
    const { authenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        if (!authenticated) {
            router.replace('/login');
            return;
        }

        // Email not verified: only allow /profile/update (and any /profile/*)
        if (user && !user.email_verified_at) {
            const isOnPerfilRoute = pathname === PERFIL_EDITAR_PATH || (pathname?.startsWith('/profile'));
            if (!isOnPerfilRoute) {
                router.replace(PERFIL_EDITAR_PATH);
            }
        }
    }, [loading, authenticated, user, pathname, router]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="mt-4 text-gray-700 font-medium">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authenticated (redirect is in progress)
    if (!authenticated) {
        return null;
    }

    // User is authenticated, render children
    return <>{children}</>;
}
