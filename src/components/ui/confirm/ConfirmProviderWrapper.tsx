"use client";

import { ReactNode } from "react";
import { ConfirmProvider } from "./ConfirmProvider";
import { ConfirmModal } from "./ConfirmModal";

/**
 * ConfirmProviderWrapper
 * 
 */
export const ConfirmProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ConfirmProvider>
      {children}
      <ConfirmModal />
    </ConfirmProvider>
  );
};

