"use client";

import { useSidebar } from '@/contexts/SidebarContext';

export function SidebarHeader() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700">
      <div className="flex items-center space-x-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-64">

        <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">
            <img src="/logo.png" alt="Logo tecnica 118" className="drop-shadow-2xl" />
          </span>
        </div>

        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-white">Técnica 118</h1>
            <p className="text-xs text-slate-300">Escuela Secundaria</p>
          </div>
        )}

      </div>
    </div>
  );
}

