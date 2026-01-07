"use client";

import { useState } from 'react';
import { getHeaderIcon } from './header.icons';

export function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const DotsIcon = getHeaderIcon('dots');

  return (
    <div className="relative md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Menú móvil"
      >
        <DotsIcon className="w-5 h-5" />
      </button>

      {/* Menú desplegable móvil */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Aquí puedes agregar acciones del menú móvil
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Opción 1
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Opción 2
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

