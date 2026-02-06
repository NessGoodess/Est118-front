"use client";

import { useState } from 'react';
import { getHeaderIcon } from './header.icons';
import { HeaderSearch } from './HeaderSearch';

export function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const DotsIcon = getHeaderIcon('dots');

  return (
    <div className="relative md:hidden flex">

      <div className="mr-2">
        <HeaderSearch />
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:text-black transition-all duration-200 focus:outline-none "
        aria-label="Menú móvil"
      >
        <DotsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-10" />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="py-1">
              <button onClick={() => { setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Opción 1</button>
              <button onClick={() => { setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Opción 2</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

