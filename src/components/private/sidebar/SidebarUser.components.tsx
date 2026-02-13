"use client";

import { getIcon } from './sidebar.icons';

/**
 * User Avatar
 * **********************
 */
interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  name?: string;
}

export function UserAvatar({ size = "md", name }: UserAvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div className={`bg-gradient-to-br from-blue-500 to-indigo-600  rounded-full flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-400 ease-in-out ${sizes[size]}`}>
      <span className="font-bold text-white">
        {name?.charAt(0).toUpperCase() || "U"}
      </span>
    </div>
  );
}

/**
 * Dropdown Header
 * **********************
 */
interface DropdownHeaderProps {
  user: {
    name?: string;
    email?: string;
  };
}

export function DropdownHeader({ user }: DropdownHeaderProps) {
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center space-x-3">
        <UserAvatar size="lg" name={user.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {user.name || "Usuario"}
          </p>
          <p className="text-xs text-secondary truncate">
            {user.email || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
/**
 * Dropdown Actions
 * **********************
 * showEditProfile: only show "Editar perfil" when true (e.g. when email is not verified)
 */

interface DropdownActionsProps {
  onEdit: () => void;
  onLogout: () => void;
  showEditProfile?: boolean;
}

export function DropdownActions({ onEdit, onLogout, showEditProfile = false }: DropdownActionsProps) {
  const EditIcon = getIcon('edit');
  const LogoutIcon = getIcon('logout');

  return (
    <div className="py-2">
      {showEditProfile && (
        <>
          <button
            onClick={onEdit}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-sidebar-button-bg-hover transition-colors duration-200"
          >
            <EditIcon className="w-4 h-4" />
            <span>Editar perfil</span>
          </button>
          <div className="border-t border-sidebar-border my-2"></div>
        </>
      )}

      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-sidebar-button-bg-hover transition-colors duration-200"
      >
        <LogoutIcon className="w-4 h-4" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
}

/**
 * User Dropdown
 * **********************
 */
interface UserDropdownProps {
  user: {
    name?: string;
    email?: string;
  };
  onEdit: () => void;
  onLogout: () => void;
  showEditProfile?: boolean;
  className?: string;
}

export function UserDropdown({ user, onEdit, onLogout, className = "" }: Omit<UserDropdownProps, 'showEditProfile'>) {
  return (
    <div className={`bg-sidebar-dropdown-bg dark:bg-gradient-to-b from-[#000D44] to-black rounded-lg shadow-xl border border-sidebar-border z-20 ${className}`}>
      <DropdownHeader user={user} />
      <div className="py-2">
        <button
          onClick={onEdit}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-sidebar-button-bg-hover transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
          </svg>
          <span>Editar perfil</span>
        </button>
        <div className="border-t border-sidebar-border my-2"></div>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-sidebar-button-bg-hover transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

