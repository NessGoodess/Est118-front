'use client';

import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import WelcomeHeader from "@/components/private/header/header";
import { ToastProvider } from "@/contexts/ToastContext";
import ModernSidebar from "@/components/private/sidebar/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, isCollapsed, isMobile } = useSidebar();

  return (
    <div className="flex h-screen">
      <ModernSidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isMobile ? 'ml-0' : isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <WelcomeHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full rounded-xl bg-gradient-to-br from-indigo-100 via-green-100 to-blue-50">{children}</div>
        </main>

      </div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <AuthProvider>
      <SidebarProvider>
        <ToastProvider>
          <LayoutContent >{children}</LayoutContent>
        </ToastProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
