"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { MenuItem } from './sidebar.types';
import { getIcon } from './sidebar.icons';

interface SidebarGroupProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SidebarGroup({ 
  item, 
  isActive, 
  isExpanded, 
  isHovered, 
  onToggle, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarGroupProps) {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();
  const Icon = getIcon(item.icon);
  const ChevronIcon = getIcon('chevron');

  return (
    <div>
      {/* Botón principal con acordeón */}
      <button
        onClick={() => {
          onToggle();
          if (isMobile) toggleSidebar();
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          w-full flex items-center text-left px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
          ${isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
            {/* Flecha del acordeón */}
            <ChevronIcon
              className={`w-4 h-4 ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </>
        )}

        {/* Indicador de página activa */}
        {isActive && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
        )}
      </button>

      {/* Submenú desplegable */}
      {!isCollapsed && (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="ml-4 mt-1 space-y-1 border-l border-slate-600 pl-4">
            {item.children?.map((child) => {
              const isChildActive = pathname === child.href;
              const ChildIcon = getIcon(child.icon);
              
              return (
                <li key={child.name}>
                  <Link
                    href={child.href!}
                    onClick={() => isMobile && toggleSidebar()}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${isChildActive
                        ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    <span className={`transition-colors duration-200 ${isChildActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-white'}`}>
                      <ChildIcon className="w-4 h-4" />
                    </span>
                    <span className="ml-3 transition-all duration-200">{child.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

