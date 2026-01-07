"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ConfirmOptions, ConfirmState, ConfirmVariant } from "./confirm.types";

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
  close: () => void;
  state: ConfirmState;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

const defaultState: ConfirmState = {
  isOpen: false,
  title: "",
  description: "",
  confirmLabel: "Confirmar",
  cancelLabel: "Cancelar",
  variant: "default",
  onConfirm: () => {},
  onCancel: undefined,
};

interface ConfirmProviderProps {
  children: ReactNode;
}

/**
 * ConfirmProvider
 * 
 * Mantiene el estado global del modal de confirmación.
 * NO ejecuta lógica de negocio, solo guarda callbacks y estado UI.
 */
export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [state, setState] = useState<ConfirmState>(defaultState);

  /**
   * Abre el modal de confirmación con las opciones proporcionadas
   */
  const confirm = useCallback((options: ConfirmOptions) => {
    setState({
      isOpen: true,
      title: options.title,
      description: options.description || "",
      confirmLabel: options.confirmLabel || "Confirmar",
      cancelLabel: options.cancelLabel || "Cancelar",
      variant: options.variant || "default",
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  /**
   * Cierra el modal de confirmación
   */
  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const value: ConfirmContextType = {
    confirm,
    close,
    state,
  };

  return (
    <ConfirmContext.Provider value={value}>
      {children}
    </ConfirmContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de confirmación
 * NO debe usarse directamente, usar useConfirm en su lugar
 */
export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error("useConfirmContext debe ser usado dentro de un ConfirmProvider");
  }
  return context;
};

