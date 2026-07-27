'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingIcon from '@/components/ui/LoadingIcon';

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
            <LoadingIcon size="lg" />
        );
    }

    // Show nothing if not authenticated (redirect is in progress)
    if (!authenticated) {
        return null;
    }

    // User is authenticated, render children
    return <>{children}</>;
}
