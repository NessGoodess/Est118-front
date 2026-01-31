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

    // Show minimal loading while checking (prevents flash)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Cargando...</div>
            </div>
        );
    }

    // Show nothing if authenticated (redirect is in progress)
    if (authenticated) {
        return null;
    }

    // User is not authenticated, render login page
    return <>{children}</>;
}
