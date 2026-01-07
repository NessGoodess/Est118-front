"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { SidebarHeader } from './SidebarHeader';
import { SidebarMenu } from './SidebarMenu';
import { SidebarUser } from './SidebarUser';

export default function ModernSidebar() {
  const { isOpen, isCollapsed, isMobile, toggleSidebar, openSidebar, closeSidebar } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl z-50 transition-all duration-300 ease-in-out
          ${isMobile
          ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64')
          : (isCollapsed ? 'w-16' : 'w-64')
        }`}
        onMouseEnter={() => !isMobile && isCollapsed && openSidebar()}
        onMouseLeave={() => !isMobile && isCollapsed && closeSidebar()}
      >
        <div className="flex flex-col h-full">
          <SidebarHeader />
          <SidebarMenu />
          <SidebarUser />
        </div>
      </aside>
    </>
  );
}
