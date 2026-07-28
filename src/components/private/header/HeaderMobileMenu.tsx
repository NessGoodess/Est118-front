"use client";

import { useState } from 'react';
import { getHeaderIcon } from './header.icons';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';

export function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const DotsIcon = getHeaderIcon('dots');

  return (
    <div className="relative md:hidden flex items-center">
      <div className="mr-2 max-w-[9rem] sm:max-w-none">
        <HeaderSearch />
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-fg-muted hover:text-foreground hover:bg-surface-muted transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Menú móvil"
      >
        <DotsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-10" />

          <div className="absolute right-0 mt-2 w-56 bg-surface-elevated text-foreground rounded-lg shadow-card border border-border z-20">
            <div className="py-2 px-2">
              <HeaderNotifications />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
