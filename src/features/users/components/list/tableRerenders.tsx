"use client";

import { IconByName } from "@/components/ui/icons";
import { labelRole } from "@/features/users/utils/permissionLabels";
import type { UserListItem } from "@/features/users/types/users";

export const tableRenderers = {
  "email-link": (value: unknown) => (
    <a
      href={`mailto:${value as string}`}
      className="text-sm text-primary hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {value as string}
    </a>
  ),
  "user-roles": (_value: unknown, row?: unknown) => {
    const user = row as UserListItem | undefined;
    if (!user?.role_names?.length) {
      return <span className="text-xs text-fg-muted">Sin roles</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {user.role_names.slice(0, 2).map((name) => (
          <span
            key={name}
            className="inline-flex items-center rounded bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground"
          >
            {labelRole(name)}
          </span>
        ))}
        {user.role_names.length > 2 ? (
          <span className="text-xs text-fg-muted">
            +{user.role_names.length - 2}
          </span>
        ) : null}
      </div>
    );
  },
  "user-verified": (value: unknown) =>
    value ? (
      <span className="inline-flex items-center gap-1 rounded bg-success/10 px-2 py-1 text-xs font-medium text-success">
        <IconByName name="check" className="h-3 w-3" />
        Verificado
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded bg-warning/20 px-2 py-1 text-xs font-medium text-warning-foreground">
        <IconByName name="alert" className="h-3 w-3" />
        No verificado
      </span>
    ),
  "user-date": (value: unknown) => (
    <span className="text-sm text-fg-muted">
      {value ? new Date(value as string).toLocaleDateString("es-MX") : "—"}
    </span>
  ),
};
