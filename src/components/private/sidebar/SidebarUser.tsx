"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/confirm';
import { useSidebar } from '@/contexts/SidebarContext';
import { getIcon } from './sidebar.icons';

export function SidebarUser() {
  const { isCollapsed } = useSidebar();
  const { user, loading, authenticated, logout } = useAuth();
  const { confirm } = useConfirm();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ChevronDownIcon = getIcon('chevronDown');
  const LogoutIcon = getIcon('logout');
  const EditIcon = getIcon('edit');

  const handleLogout = () => {
    confirm({
      title: 'Cerrar sesión',
      description: '¿Seguro que quieres cerrar tu sesión?',
      variant: 'danger',
      confirmLabel: 'Cerrar sesión',
      cancelLabel: 'Cancelar',
      onConfirm: logout,
    });
    setIsDropdownOpen(false);
  };

  const handleEditProfile = () => {
    // TODO: Implementar navegación a editar perfil
    console.log('Editar perfil');
    setIsDropdownOpen(false);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (loading) {
    return (
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse"></div>
          {!isCollapsed && (
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse w-24"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="p-4 border-t border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-slate-400">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-400">No autenticado</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-slate-700" ref={dropdownRef}>
      {!isCollapsed ? (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center space-x-3 hover:bg-slate-800 rounded-lg p-2 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user.name || 'Usuario'}
              </p>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-20">
                {/* Header del dropdown con foto y datos */}
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-base font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-slate-300 truncate">
                        {user.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opciones del dropdown */}
                <div className="py-2">
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Editar perfil</span>
                  </button>
                  
                  {/* Espacio para agregar más opciones */}
                  {/* 
                  <button
                    onClick={() => {
                      // Nueva opción
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <span>Nueva opción</span>
                  </button>
                  */}

                  <div className="border-t border-slate-700 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <LogoutIcon className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative flex justify-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
            title="Menú de usuario"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </button>

          {/* Dropdown para sidebar colapsado */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-20">
                {/* Header del dropdown con foto y datos */}
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-base font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-slate-300 truncate">
                        {user.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opciones del dropdown */}
                <div className="py-2">
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Editar perfil</span>
                  </button>
                  
                  {/* Espacio para agregar más opciones */}
                  {/* 
                  <button
                    onClick={() => {
                      // Nueva opción
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <span>Nueva opción</span>
                  </button>
                  */}

                  <div className="border-t border-slate-700 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors duration-200"
                  >
                    <LogoutIcon className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

