"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ADMISSION_PERMISSIONS } from "@/features/admissions/permissions";

export type AdmissionCapabilities = {
  canList: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewEnrollment: boolean;
  canEditEnrollment: boolean;
  can: (permission: string) => boolean;
};

/**
 * UI capabilities for the pre-enrollment / admission enrollment flow.
 */
export function useAdmissionCapabilities(): AdmissionCapabilities {
  const { hasPermission } = useAuth();

  const can = useCallback(
    (permission: string) => hasPermission(permission),
    [hasPermission]
  );

  return useMemo(
    () => ({
      canList: hasPermission(ADMISSION_PERMISSIONS.viewPreEnrollments),
      canCreate: hasPermission(ADMISSION_PERMISSIONS.createPreEnrollments),
      canEdit: hasPermission(ADMISSION_PERMISSIONS.editPreEnrollments),
      canDelete: hasPermission(ADMISSION_PERMISSIONS.deletePreEnrollments),
      canViewEnrollment: hasPermission(
        ADMISSION_PERMISSIONS.viewAdmissionEnrollment
      ),
      canEditEnrollment: hasPermission(
        ADMISSION_PERMISSIONS.editAdmissionEnrollment
      ),
      can,
    }),
    [hasPermission, can]
  );
}
