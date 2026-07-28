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
          className="fixed inset-0 bg-modal-overlay z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden
        />
      )}

      <aside
        className={`bg-surface-app md:bg-transparent fixed left-0 top-0 h-full z-50 transition-[width,transform] duration-400 ease-in-out border-r border-sidebar-border md:border-none overflow-hidden
          ${
            isMobile
              ? isOpen
                ? 'translate-x-0 w-64'
                : '-translate-x-full w-64'
              : isCollapsed
                ? 'w-16'
                : 'w-64'
          }`}
      >
        {/* Grid keeps user footer pinned; inner w-64 preserves icon alignment when collapsed */}
        <div className="grid h-full min-h-0 w-64 grid-rows-[auto_1fr_auto]">
          <SidebarHeader />
          <SidebarMenu />
          <SidebarUser />
        </div>
      </aside>
    </>
  );
}
