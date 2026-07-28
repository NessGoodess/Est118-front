"use client";

import Image from 'next/image';

export function SidebarHeader() {
  return (
    <div className="flex items-center border-b border-sidebar-border shrink-0 overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-4 w-64 min-w-[16rem]">
        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center relative">
          <Image
            src="/logo.PNG"
            alt="Logo tecnica 118"
            width={40}
            height={40}
            className="drop-shadow-2xl"
          />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="text-lg font-bold text-foreground truncate">Técnica 118</h1>
          <p className="text-xs text-fg-muted truncate">Escuela Secundaria</p>
        </div>
      </div>
    </div>
  );
}
