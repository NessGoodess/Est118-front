"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/confirm';
import { useSidebar } from '@/contexts/SidebarContext';
import { getIcon } from './sidebar.icons';
import { UserAvatar, UserDropdown } from './SidebarUser.components';

export function SidebarUser() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const { user, loading, authenticated, logout } = useAuth();
  const { confirm } = useConfirm();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ChevronDownIcon = getIcon('chevronDown');

  if (loading) {
    return (
      <div className="relative z-10 shrink-0 border-t border-sidebar-border bg-surface-app md:bg-transparent p-4">
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
      <div className="relative z-10 shrink-0 border-t border-sidebar-border bg-surface-app md:bg-transparent p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-loading-base rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-fg-muted">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">No autenticado</p>
            </div>
          </div>
        )}
      </div>
    );
  }



  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    router.push('/profile/update');
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
    <div
      className="relative z-10 shrink-0 border-t border-sidebar-border bg-surface-app md:bg-transparent text-foreground"
      ref={dropdownRef}
    >
      <div className="relative py-4 px-3 w-64 min-w-[16rem]">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center w-full min-w-0 overflow-hidden hover:bg-sidebar-button-bg-hover hover:text-sidebar-button-text rounded-lg p-2 transition-colors duration-200 group"
          title={isCollapsed ? 'Menú de usuario' : undefined}
        >
          <span className="shrink-0">
            <UserAvatar size="md" name={user.name} />
          </span>

          <div className="flex ml-3 min-w-0 flex-1 overflow-hidden">
            <div className="flex-1 min-w-0 text-left max-w-32">
              <p className="text-sm font-medium truncate">{user.name || 'Usuario'}</p>
            </div>
            <ChevronDownIcon
              className={`ml-2 w-4 h-4 shrink-0 text-fg-muted group-hover:text-sidebar-button-text transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
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

