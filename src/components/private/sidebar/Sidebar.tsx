"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { SidebarHeader } from './SidebarHeader';
import { SidebarMenu } from './SidebarMenu';
import { SidebarUser } from './SidebarUser';

export default function ModernSidebar() {
  const { isOpen, isCollapsed, isMobile, toggleSidebar } = useSidebar();

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}


      <aside className={`bg-surface-app dark:bg-gradient-to-b from-[#000D44] to-[#000000]  md:bg-transparent fixed left-0 top-0 h-full z-50 transition-all duration-400 ease-in-out border-r border-sidebar-border md:border-none
          ${isMobile 
          ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64')
          : (isCollapsed ? 'w-16 overflow-visible' : 'w-64 overflow-hidden')
        } `}
      >
        <div className="flex flex-col h-full overflow-x-visible">
          <SidebarHeader />
          <SidebarMenu />
          <SidebarUser />
        </div>
      </aside>
    </>
  );
}
