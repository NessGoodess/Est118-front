import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ClientLayout from './layout.client';

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <ClientLayout>
            {children}
        </ClientLayout>
    );
}



/*"use client";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import WelcomeHeader from "@/components/private/header/header"; 
import { ToastProvider } from "@/contexts/ToastContext";
import ModernSidebar from "@/components/private/sidebar/Sidebar";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, isCollapsed, isMobile } = useSidebar();
    
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <ModernSidebar />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                isMobile 
                    ? 'ml-0' 
                    : (isCollapsed ? 'md:ml-16' : 'md:ml-64')
            }`}>
                <WelcomeHeader />
                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function PrivateLayout({ children, }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ToastProvider>
                <LayoutContent>{children}</LayoutContent>
            </ToastProvider>
        </SidebarProvider>
    );
};*/