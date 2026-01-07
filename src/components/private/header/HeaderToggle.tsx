"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { getHeaderIcon } from './header.icons';

export function HeaderToggle() {
  const { isOpen, toggleSidebar } = useSidebar();
  const MenuIcon = getHeaderIcon('menu');

  return (
    <button 
      onClick={toggleSidebar}
      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
      title={isOpen ? "Contraer menú" : "Expandir menú"}
      aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
    >
      <MenuIcon className="w-6 h-6" />
    </button>
  );
}

