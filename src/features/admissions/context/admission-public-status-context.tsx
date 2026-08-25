"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdmissionStatusResponse } from "@/features/admissions/types/admission-cycles";
import {
  admissionHeroCtaLabel,
  admissionNavLabel,
  isAdmissionFormOpen,
} from "@/features/admissions/lib/get-admission-status";

type AdmissionPublicStatusContextValue = {
  status: AdmissionStatusResponse;
  navLabel: string;
  heroCtaLabel: string;
  formOpen: boolean;
};

const AdmissionPublicStatusContext =
  createContext<AdmissionPublicStatusContextValue | null>(null);

export function AdmissionPublicStatusProvider({
  status,
  children,
}: {
  status: AdmissionStatusResponse;
  children: ReactNode;
}) {
  const value: AdmissionPublicStatusContextValue = {
    status,
    navLabel: admissionNavLabel(status),
    heroCtaLabel: admissionHeroCtaLabel(status),
    formOpen: isAdmissionFormOpen(status),
  };

  return (
    <AdmissionPublicStatusContext.Provider value={value}>
      {children}
    </AdmissionPublicStatusContext.Provider>
  );
}

export function useAdmissionPublicStatus(): AdmissionPublicStatusContextValue {
  const ctx = useContext(AdmissionPublicStatusContext);
  if (!ctx) {
    throw new Error(
      "useAdmissionPublicStatus must be used within AdmissionPublicStatusProvider"
    );
  }
  return ctx;
}
