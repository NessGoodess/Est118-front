"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ACADEMIC_YEAR_PERMISSIONS } from "@/features/academic-years/permissions";

export type AcademicYearCapabilities = {
  canView: boolean;
  canCreate: boolean;
  canDelete: boolean;
  can: (permission: string) => boolean;
};

export function useAcademicYearCapabilities(): AcademicYearCapabilities {
  const { hasPermission } = useAuth();

  const can = useCallback(
    (permission: string) => hasPermission(permission),
    [hasPermission]
  );

  return useMemo(
    () => ({
      canView: hasPermission(ACADEMIC_YEAR_PERMISSIONS.view),
      canCreate: hasPermission(ACADEMIC_YEAR_PERMISSIONS.create),
      canDelete: hasPermission(ACADEMIC_YEAR_PERMISSIONS.delete),
      can,
    }),
    [hasPermission, can]
  );
}
