'use client';

import React from "react";
import AuthGuard from "@/components/guards/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export default function LoginLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <AuthGuard>
                <main className="min-h-screen flex items-center justify-center">
                    {children}
                </main>
            </AuthGuard>
        </AuthProvider>
    );
}
