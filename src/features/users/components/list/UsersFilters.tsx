"use client";

import { useEffect, useState } from "react";
import {
  getRoles,
  type Role,
} from "@/features/users/services/users.service";
import { labelRole } from "@/features/users/utils/permissionLabels";
import type { UsersListFilters } from "@/features/users/hooks/list/useUsers";
import { ToolbarSelect } from "@/components/ui/ToolbarSelect";

type UsersFiltersProps = {
  filters: UsersListFilters;
  onChange: (next: UsersListFilters) => void;
};

export default function UsersFilters({ filters, onChange }: UsersFiltersProps) {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getRoles();
        if (!cancelled) setRoles(data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex justify-end gap-2 w-full">
      <ToolbarSelect
        id="users-filter-role"
        label="Filtrar por rol"
        value={filters.role}
        onChange={(e) => onChange({ ...filters, role: e.target.value })}
      >
        <option value="">Todos los roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {labelRole(role.name)}
          </option>
        ))}
      </ToolbarSelect>

      <ToolbarSelect
        id="users-filter-verified"
        label="Filtrar por verificación"
        value={
          filters.verified === undefined
            ? ""
            : filters.verified
              ? "true"
              : "false"
        }
        onChange={(e) => {
          const value = e.target.value;
          onChange({
            ...filters,
            verified: value === "" ? undefined : value === "true",
          });
        }}
      >
        <option value="">Todos</option>
        <option value="true">Verificados</option>
        <option value="false">No verificados</option>
      </ToolbarSelect>
    </div>
  );
}
