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
      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none 
      active:text-black transition-all duration-200"
      title={isCollapsed ? "Expandir menú" : "Contraer menú"}
      aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
    >
      <MenuIcon className='active:text-blue-900'/>
    </button>
  );
}

