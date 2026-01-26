'use client';

import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import WelcomeHeader from "@/components/private/header/header";
import { ToastProvider } from "@/contexts/ToastContext";
import ModernSidebar from "@/components/private/sidebar/Sidebar";
import PrivateGuard from "@/components/guards/PrivateGuard";

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="flex h-screen bg-surface-app">
      <ModernSidebar />
      <div className={`flex-1 flex flex-col transition-all duration-400 ease-in-out rounded-l-2xl rounded-r-none my-4 shadow-card bg-gradient-to-br from-blue-100 to-indigo-100 ${isMobile ? 'ml-0' : isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <main className="flex-1 overflow-y-auto rounded-l-2xl">
          <WelcomeHeader />
          <div className="min-h-full p-2 md:p-4">{children}</div>
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
    <PrivateGuard>
      <SidebarProvider>
        <ToastProvider>
          <LayoutContent >{children}</LayoutContent>
        </ToastProvider>
      </SidebarProvider>
    </PrivateGuard>
  );
}
