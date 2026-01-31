'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * PrivateGuard - Protects private routes from unauthenticated users
 * Shows loading spinner while checking authentication to prevent flash
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
