/**
 * Tipos para el sistema de confirmación global
 * 
 * El modal es genérico y no conoce lógica de negocio (logout, delete, etc.)
 * Solo maneja confirmaciones UI.
 */

export type ConfirmVariant = 'danger' | 'default';

export interface ConfirmOptions {
  /** Título del modal */
  title: string;
  /** Descripción o mensaje del modal */
  description?: string;
  /** Texto del botón de confirmar */
  confirmLabel?: string;
  /** Texto del botón de cancelar */
  cancelLabel?: string;
  /** Variante visual (danger para acciones peligrosas) */
  variant?: ConfirmVariant;
  /** Callback a ejecutar cuando se confirma */
  onConfirm: () => void | Promise<void>;
  /** Callback opcional a ejecutar cuando se cancela */
  onCancel?: () => void;
}

export interface ConfirmState extends ConfirmOptions {
  /** Estado de apertura del modal */
  isOpen: boolean;
}

