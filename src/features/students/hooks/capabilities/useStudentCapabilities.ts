"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { STUDENT_PERMISSIONS } from "@/features/students/permissions";

export type { StudentPermission } from "@/features/students/permissions";
export { STUDENT_PERMISSIONS } from "@/features/students/permissions";

export type StudentCapabilities = {
  canList: boolean;
  canViewProfile: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canViewPhoto: boolean;
  canManagePhoto: boolean;
  canPrintCredentials: boolean;
  canDelete: boolean;
  can: (permission: string) => boolean;
};

/**
 * UI capabilities for the students admin feature.
 */
export function useStudentCapabilities(): StudentCapabilities {
  const { hasPermission } = useAuth();

  const can = useCallback(
    (permission: string) => hasPermission(permission),
    [hasPermission]
  );

  return useMemo(
    () => ({
      canList: hasPermission(STUDENT_PERMISSIONS.view),
      canViewProfile: hasPermission(STUDENT_PERMISSIONS.view),
      canCreate: hasPermission(STUDENT_PERMISSIONS.create),
      canEdit: hasPermission(STUDENT_PERMISSIONS.edit),
      canViewPhoto: hasPermission(STUDENT_PERMISSIONS.viewPhotos),
      canManagePhoto: hasPermission(STUDENT_PERMISSIONS.managePhotos),
      canPrintCredentials: hasPermission(STUDENT_PERMISSIONS.view),
      canDelete: hasPermission(STUDENT_PERMISSIONS.delete),
      can,
    }),
    [hasPermission, can]
  );
}
