'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * AuthGuard - Protects auth routes (login, register) from authenticated users
 * Redirects logged-in users to dashboard
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { authenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect after loading is complete and user is authenticated
        if (!loading && authenticated) {
            router.replace('/dashboard');
        }
    }, [loading, authenticated, router]);

    // Show nothing while loading
    if (loading) {
        return null;
    }

    // Show nothing if authenticated (redirect is in progress)
    if (authenticated) {
        return null;
    }

    // User is not authenticated, render login page
    return <>{children}</>;
}
