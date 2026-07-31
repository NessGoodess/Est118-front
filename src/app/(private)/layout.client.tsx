'use client';
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import WelcomeHeader from "@/components/private/header/header";
import { ToastProvider } from "@/contexts/ToastContext";
import ModernSidebar from "@/components/private/sidebar/Sidebar";
import PrivateGuard from "@/components/guards/PrivateGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { HeaderBreadcrumbs } from "@/components/private/header/HeaderBreadcrumbs";
import OverlayScrollArea from "@/components/ui/OverlayScrollArea";

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="flex h-dvh bg-surface-app text-foreground overflow-x-hidden min-w-0">
      <ModernSidebar />
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-0 transition-all duration-400 ease-in-out rounded-l-2xl rounded-r-none shadow-card bg-surface-panel border border-border border-r-0
        ${isMobile ? "ml-0 my-1" : isCollapsed ? "md:ml-16 my-4" : "md:ml-64 my-4"}`}
      >
        <OverlayScrollArea
          as="main"
          className="flex-1 rounded-l-2xl bg-surface-panel text-foreground"
        >
          <div className="flex min-h-full flex-col">
            <WelcomeHeader />
            <HeaderBreadcrumbs />
            <div className="min-w-0 flex-1 px-2 2xl:px-6">{children}</div>
          </div>
        </OverlayScrollArea>
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
      <ToastProvider>
        <NotificationProvider>
          <PrivateGuard>
            <SidebarProvider>
              <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
          </PrivateGuard>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
