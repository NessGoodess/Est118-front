"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { notifyUsersListChanged } from "@/features/users/lib/usersListEvents";

type UsersRouteModalProps = {
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "min-h-dvh";
  reopenKey: string;
  children: React.ReactNode;
};

/**
 * Cierre definitivo (X / backdrop / Escape / éxito destructivo):
 * va a /users y limpia el slot @modal (vía @modal/page.tsx + refresh).
 */
export function useCloseUsersModal() {
  const router = useRouter();
  return useCallback(() => {
    router.replace("/users");
    router.refresh();
  }, [router]);
}

/** Cancelar en formularios: un paso atrás en el historial (ver ← editar). */
export function useCancelUsersModal() {
  const router = useRouter();
  return useCallback(() => {
    router.back();
  }, [router]);
}

/** Cierra a /users y pide refetch de la tabla (create / delete). */
export function useCloseUsersModalAndRefreshList() {
  const close = useCloseUsersModal();
  return useCallback(() => {
    notifyUsersListChanged();
    close();
  }, [close]);
}

export default function UsersRouteModal({
  title,
  maxWidth = "6xl",
  reopenKey,
  children,
}: UsersRouteModalProps) {
  const onClose = useCloseUsersModal();

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      reopenKey={reopenKey}
    >
      {children}
    </Modal>
  );
}
