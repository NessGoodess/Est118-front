"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { getHeaderIcon } from './header.icons';

export function HeaderToggle() {
  const { toggleSidebar, isCollapsed, isMobile } = useSidebar();
  const MenuIcon = getHeaderIcon(
    isMobile
      ? 'menu'
      : isCollapsed
        ? 'menu_open'
        : 'menu_close'
  );

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="p-2 rounded-lg text-fg-muted hover:text-foreground hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:text-foreground transition-all duration-200"
      title={isCollapsed ? "Expandir menú" : "Contraer menú"}
      aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
    >
      <MenuIcon className="active:text-primary" />
    </button>
  );
}
