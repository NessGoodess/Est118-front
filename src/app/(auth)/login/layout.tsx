'use client';

import React from "react";
import AuthGuard from "@/components/guards/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export default function LoginLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <AuthGuard>
                <main className="min-h-dvh flex items-center justify-center bg-surface-app">
                    {children}
                </main>
            </AuthGuard>
        </AuthProvider>
    );
}
