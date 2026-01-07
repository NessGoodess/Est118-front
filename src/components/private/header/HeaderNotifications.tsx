"use client";

import { useState } from 'react';
import { getHeaderIcon } from './header.icons';

interface HeaderNotificationsProps {
  count?: number;
}

export function HeaderNotifications({ count = 0 }: HeaderNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const NotificationIcon = getHeaderIcon('notifications');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notificaciones"
      >
        <NotificationIcon className="w-4 h-4 mr-2 inline" />
        Notificaciones
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones (placeholder) */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
            </div>
            <div className="p-4">
              {count === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay notificaciones nuevas
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Aquí irían las notificaciones */}
                  <p className="text-sm text-gray-500">Lista de notificaciones...</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

