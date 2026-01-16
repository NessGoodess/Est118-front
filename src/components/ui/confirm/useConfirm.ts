"use client";

import { useConfirmContext } from "./ConfirmProvider";

/**
 * useConfirm
 * 
 * API pública para abrir confirmaciones desde cualquier parte de la app.
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
     * Abre el modal de confirmación
     * 
     * @param options - Opciones de confirmación
     */
    confirm,
    /**
     * Cierra el modal de confirmación manualmente
     */
    close,
  };
};

