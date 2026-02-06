/**
 * Types for global confirmation system
 * 
 * The modal is generic and does not know business logic (logout, delete, etc.)
 * Only handles UI confirmations.
 */

export type ConfirmVariant = 'danger' | 'default';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
}

