"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { notifyPreEnrollmentsListChanged } from "@/features/admissions/lib/pre-enrollments-list-events";

type AdmissionsRouteModalProps = {
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "min-h-dvh";
  reopenKey: string;
  children: React.ReactNode;
};

const LIST_PATH = "/admissions/applications";

/** Close permanently (X / backdrop / Escape / destructive success) */
export function useCloseAdmissionsModal() {
  const router = useRouter();
  return useCallback(() => {
    router.replace(LIST_PATH);
    router.refresh();
  }, [router]);
}

/** Cancel in forms: one step back (see ← edit).*/

export function useCancelAdmissionsModal() {
  const router = useRouter();
  return useCallback(() => {
    router.back();
  }, [router]);
}

/** Close to the list and request refetch of the table (create / delete).*/
export function useCloseAdmissionsModalAndRefreshList() {
  const close = useCloseAdmissionsModal();
  return useCallback(() => {
    notifyPreEnrollmentsListChanged();
    close();
  }, [close]);
}

export default function AdmissionsRouteModal({
  title,
  maxWidth = "6xl",
  reopenKey,
  children,
}: AdmissionsRouteModalProps) {
  const onClose = useCloseAdmissionsModal();

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
