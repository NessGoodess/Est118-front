"use client";

import { useConfirmContext } from "./ConfirmProvider";

/**
 * useConfirm
 * 
 * API for opening confirmations from any part of the app.
 * 
 * @example
 * ```tsx
 * const { confirm } = useConfirm();
 * const { logout } = useAuth();
 * 
 * <button onClick={() => 
 *   confirm({
 *     title: 'Cerrar sesión',
 *     description: '¿Seguro que quieres salir?',
 *     onConfirm: logout,
 *   })
 * }>
 *   Logout
 * </button>
 * ```
 */
export const useConfirm = () => {
  const { confirm, close } = useConfirmContext();

  return {
    /**
     * Opens the confirmation modal
     * 
     * @param options - Confirmation options
     */
    confirm,
    /**
     * Closes the confirmation modal manually
     */
    close,
  };
};

