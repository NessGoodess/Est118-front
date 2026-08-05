"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { USER_PERMISSIONS } from "@/features/users/permissions";

export type UserCapabilities = {
  canList: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  can: (permission: string) => boolean;
};

/**
 * UI capabilities for the users feature.
 */
export function useUserCapabilities(): UserCapabilities {
  const { hasPermission } = useAuth();

  const can = useCallback(
    (permission: string) => hasPermission(permission),
    [hasPermission]
  );

  return useMemo(
    () => ({
      canList: hasPermission(USER_PERMISSIONS.view),
      canCreate: hasPermission(USER_PERMISSIONS.create),
      canEdit: hasPermission(USER_PERMISSIONS.edit),
      canDelete: hasPermission(USER_PERMISSIONS.delete),
      can,
    }),
    [hasPermission, can]
  );
}
