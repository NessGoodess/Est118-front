"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ConfirmOptions, ConfirmState } from "./confirm.types";

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

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [state, setState] = useState<ConfirmState>(defaultState);

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

export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error("useConfirmContext debe ser usado dentro de un ConfirmProvider");
  }
  return context;
};

