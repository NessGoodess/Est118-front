"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/confirm';
import { useSidebar } from '@/contexts/SidebarContext';
import { getIcon } from './sidebar.icons';
import { UserAvatar, UserDropdown } from './SidebarUser.components';

export function SidebarUser() {
  const { isCollapsed } = useSidebar();
  const { user, loading, authenticated, logout } = useAuth();
  const { confirm } = useConfirm();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ChevronDownIcon = getIcon('chevronDown');

  if (loading) {
    return (
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-loading-base rounded-full animate-pulse"></div>
          {!isCollapsed && (
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-loading-base rounded animate-pulse w-24"></div>
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
            <div className="w-10 h-10 bg-loading-base rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">No autenticado</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleEditProfile = () => {
    // TODO: Implementar navegación a editar perfil
    console.log('Editar perfil');
    setIsDropdownOpen(false);
  };

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

  return (
    <div className="flex border-t border-sidebar-border text-primary" ref={dropdownRef}>
      <div className={`relative py-4 ${isCollapsed ? ' justify-start px-2' : ' justify-center px-4'}`}>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center  hover:bg-sidebar-button-bg-hover hover:text-sidebar-button-text rounded-lg p-2 transition-all duration-200 group
          ${isCollapsed ? 'text-sidebar-group-text hover:text-sidebar-button-text' : 'w-full'} `}
          title={isCollapsed ? "Menú de usuario" : undefined}
        >
          <UserAvatar size={isCollapsed ? "sm" : "md"} name={user.name} />

          <div className={`flex overflow-hidden transition-all duration-400 ${isCollapsed ? ' max-w-0' : ' ml-3 max-w-full'}`}>
            <div className={`flex-1 min-w-0 text-left max-w-32`}>
              <p className=" text-sm font-medium truncate">
                {user.name || 'Usuario'}
              </p>
            </div>
            <ChevronDownIcon className={`ml-2 w-4 h-4 text-primary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <UserDropdown
              user={user}
              onEdit={handleEditProfile}
              onLogout={handleLogout}
              className={`transition-all duration-400 ${isCollapsed
                ? "fixed bottom-20 left-20 "
                : "absolute bottom-full left-0 mb-2 translate-x-4"}`}
            />
          </>
        )}
      </div>
    </div>
  );
}

