"use client";

import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { MenuItem } from './sidebar.types';
import { getIcon } from './sidebar.icons';

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SidebarItem({ 
  item, 
  isActive, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarItemProps) {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const Icon = getIcon(item.icon);

  return (
    <Link
      href={item.href!}
      onClick={() => isMobile && toggleSidebar()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
        ${isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      {/* Tooltip para modo colapsado */}
      {isCollapsed && isHovered && (
        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap border border-slate-600">
          {item.name}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
        </div>
      )}

      <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
        <Icon className={isCollapsed ? "w-5 h-5" : "w-5 h-5"} />
      </span>
      {!isCollapsed && (
        <>
          <span className="ml-3 transition-all duration-200">{item.name}</span>
          {item.badge && (
            <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Indicador de página activa */}
      {isActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
      )}
    </Link>
  );
}

