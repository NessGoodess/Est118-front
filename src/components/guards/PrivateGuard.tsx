'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * PrivateGuard - Protects private routes from unauthenticated users
 * Prevents flash by blocking render until auth state is loaded
 */
export default function PrivateGuard({ children }: { children: React.ReactNode }) {
    const { authenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect after loading is complete and user is not authenticated
        if (!loading && !authenticated) {
            router.replace('/login');
        }
    }, [loading, authenticated, router]);

    // Show nothing while loading (prevents flash)
    if (loading) {
        return null;
    }

    // Show nothing if not authenticated (redirect is in progress)
    if (!authenticated) {
        return null;
    }

    // User is authenticated, render children
    return <>{children}</>;
}
