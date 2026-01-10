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
 */

interface DropdownActionsProps {
  onEdit: () => void;
  onLogout: () => void; 
}

export function DropdownActions({ onEdit, onLogout }: DropdownActionsProps) {
  const EditIcon = getIcon('edit');
  const LogoutIcon = getIcon('logout');

  return (
    <div className="py-2">
      <button
        onClick={onEdit}
        className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-sidebar-button-bg-hover transition-colors duration-200"
      >
        <EditIcon className="w-4 h-4" />
        <span>Editar perfil</span>
      </button>
      
      <div className="border-t border-sidebar-border my-2"></div>
      
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
  className?: string;
}

export function UserDropdown({ user, onEdit, onLogout, className = "" }: UserDropdownProps) {
  return (
    <div className={`bg-sidebar-dropdown-bg dark:bg-gradient-to-b from-[#000D44] to-black rounded-lg shadow-xl border border-sidebar-border z-20 ${className}`}>
      <DropdownHeader user={user} />
      <DropdownActions onEdit={onEdit} onLogout={onLogout} />
    </div>
  );
}

