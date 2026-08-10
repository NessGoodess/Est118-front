"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GENERAL_ATTENDANCE_PERMISSIONS } from "@/features/general-attendance/permissions";

export type GeneralAttendanceCapabilities = {
  canView: boolean;
  canManageReadings: boolean;
  canEdit: boolean;
  can: (permission: string) => boolean;
};

export function useGeneralAttendanceCapabilities(): GeneralAttendanceCapabilities {
  const { hasPermission } = useAuth();

  const can = useCallback(
    (permission: string) => hasPermission(permission),
    [hasPermission]
  );

  return useMemo(
    () => ({
      canView: hasPermission(GENERAL_ATTENDANCE_PERMISSIONS.view),
      canManageReadings: hasPermission(GENERAL_ATTENDANCE_PERMISSIONS.manage),
      canEdit: hasPermission(GENERAL_ATTENDANCE_PERMISSIONS.edit),
      can,
    }),
    [hasPermission, can]
  );
}
