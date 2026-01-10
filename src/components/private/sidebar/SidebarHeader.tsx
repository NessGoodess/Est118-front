"use client";

import { useSidebar } from '@/contexts/SidebarContext';

export function SidebarHeader() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex items-center  border-b border-sidebar-border">
      <div className={`flex items-center space-x-3 px-4 max-w-64 justify-center py-4 transition-[padding] duration-400 ease-in-out
      ${isCollapsed
          ? ''
          : ''}
      `}>

        <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-foreground font-bold text-lg">
            <img src="/logo.png" alt="Logo tecnica 118" className="drop-shadow-2xl" />
          </span>
        </div>


        <div className={`overflow-hidden whitespace-nowrap transition-[max-width] duration-400 ease-in-out
          ${isCollapsed
            ? 'max-w-0'
            : 'max-w-64'}
          `}>
          <h1 className="text-lg font-bold text-foreground">Técnica 118</h1>
          <p className="text-xs text-foreground-app">Escuela Secundaria</p>
        </div>


      </div>
    </div>
  );
}

