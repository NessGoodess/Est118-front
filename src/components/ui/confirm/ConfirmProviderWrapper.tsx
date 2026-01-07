"use client";

import { ReactNode } from "react";
import { ConfirmProvider } from "./ConfirmProvider";
import { ConfirmModal } from "./ConfirmModal";

/**
 * ConfirmProviderWrapper
 * 
 * Wrapper que monta el Provider y el Modal global.
 * Debe montarse una sola vez en el root de la aplicación.
 */
export const ConfirmProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ConfirmProvider>
      {children}
      <ConfirmModal />
    </ConfirmProvider>
  );
};

