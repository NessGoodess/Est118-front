"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPermissions,
  type Permission,
} from "@/features/users/services/users.service";
import {
  labelPermission,
  labelPermissionResource,
  labelPermissionVerb,
  parsePermissionName,
  PERMISSION_VERB_ORDER,
} from "@/features/users/utils/permissionLabels";
import { Checkbox } from "@/components/ui/Checkbox";
import PermissionTableSkeleton from "@/features/users/components/shared/PermissionTableSkeleton";

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

type MatrixCell = {
  name: string;
  id: number;
};

function sortVerbs(verbs: string[]): string[] {
  const rank = new Map(
    PERMISSION_VERB_ORDER.map((verb, index) => [verb, index])
  );
  return [...verbs].sort((a, b) => {
    const ra = rank.get(a as (typeof PERMISSION_VERB_ORDER)[number]) ?? 100;
    const rb = rank.get(b as (typeof PERMISSION_VERB_ORDER)[number]) ?? 100;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
}

function selectionState(names: string[], selected: string[]) {
  const selectedCount = names.filter((n) => selected.includes(n)).length;
  return {
    all: names.length > 0 && selectedCount === names.length,
    some: selectedCount > 0 && selectedCount < names.length,
    none: selectedCount === 0,
  };
}

function toggleNames(
  selected: string[],
  names: string[],
  selectAll: boolean
): string[] {
  if (selectAll) {
    const next = [...selected];
    for (const name of names) {
      if (!next.includes(name)) next.push(name);
    }
    return next;
  }
  return selected.filter((p) => !names.includes(p));
}

export default function PermissionSelector({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const [flatPermissions, setFlatPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPermissions();
        if (!cancelled) {
          setFlatPermissions(Object.values(data).flat());
        }
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { resources, verbs, cells } = useMemo(() => {
    const cellMap = new Map<string, MatrixCell>();
    const resourceSet = new Set<string>();
    const verbSet = new Set<string>();

    for (const permission of flatPermissions) {
      const { verb, resource } = parsePermissionName(permission.name);
      resourceSet.add(resource);
      verbSet.add(verb);
      cellMap.set(`${resource}::${verb}`, {
        name: permission.name,
        id: permission.id,
      });
    }

    const resourceList = [...resourceSet].sort((a, b) =>
      labelPermissionResource(a).localeCompare(labelPermissionResource(b), "es")
    );

    return {
      resources: resourceList,
      verbs: sortVerbs([...verbSet]),
      cells: cellMap,
    };
  }, [flatPermissions]);

  const allNames = useMemo(
    () => flatPermissions.map((p) => p.name),
    [flatPermissions]
  );

  const globalState = selectionState(allNames, selectedPermissions);

  const handleCellToggle = (name: string) => {
    if (disabled) return;
    onChange(
      selectedPermissions.includes(name)
        ? selectedPermissions.filter((p) => p !== name)
        : [...selectedPermissions, name]
    );
  };

  const handleToggleGroup = (names: string[]) => {
    if (disabled || names.length === 0) return;
    const { all } = selectionState(names, selectedPermissions);
    onChange(toggleNames(selectedPermissions, names, !all));
  };

  if (loading) {
    return <PermissionTableSkeleton />;
  }

  if (resources.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-fg-muted">
        No hay permisos disponibles
      </p>
    );
  }

  return (
    <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-border [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]">
      <table className="w-max min-w-[20rem] border-collapse text-sm sm:w-full">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-surface-muted px-1 py-1 text-left font-semibold text-foreground lg:px-3 lg:py-2.5"
              >
                <div className="flex items-center gap-1 lg:gap-2">
                  <Checkbox
                    aria-label="Seleccionar todos los permisos"
                    checked={globalState.all}
                    indeterminate={globalState.some}
                    disabled={disabled}
                    onChange={() => handleToggleGroup(allNames)}
                  />
                  <span>Área</span>
                </div>
              </th>
              {verbs.map((verb) => {
                const colNames = resources
                  .map((resource) => cells.get(`${resource}::${verb}`)?.name)
                  .filter((name): name is string => Boolean(name));
                const colState = selectionState(colNames, selectedPermissions);

                return (
                  <th
                    key={verb}
                    scope="col"
                    className="px-1 lg:px-2 py-1 lg:py-2.5 text-center font-semibold text-foreground"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <Checkbox
                        aria-label={`Seleccionar todos: ${labelPermissionVerb(verb)}`}
                        checked={colState.all}
                        indeterminate={colState.some}
                        disabled={disabled || colNames.length === 0}
                        onChange={() => handleToggleGroup(colNames)}
                      />
                      <span className="whitespace-nowrap text-xs">
                        {labelPermissionVerb(verb)}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-elevated">
            {resources.map((resource) => {
              const rowNames = verbs
                .map((verb) => cells.get(`${resource}::${verb}`)?.name)
                .filter((name): name is string => Boolean(name));
              const rowState = selectionState(rowNames, selectedPermissions);

              return (
                <tr key={resource} className="hover:bg-surface-muted/60">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-surface-elevated px-1 py-1 text-left font-medium text-foreground lg:px-3 lg:py-2 border-r border-border"
                  >
                    <div className="flex  items-center gap-1 lg:gap-2">
                      <Checkbox
                        aria-label={`Seleccionar área: ${labelPermissionResource(resource)}`}
                        checked={rowState.all}
                        indeterminate={rowState.some}
                        disabled={disabled || rowNames.length === 0}
                        onChange={() => handleToggleGroup(rowNames)}
                      />
                      <span className="whitespace-nowrap text-xs lg:text-sm">
                        {labelPermissionResource(resource)}
                      </span>
                    </div>
                  </th>
                  {verbs.map((verb) => {
                    const cell = cells.get(`${resource}::${verb}`);
                    if (!cell) {
                      return (
                        <td
                          key={`${resource}-${verb}`}
                          className="px-2 py-2 text-center text-fg-muted"
                        >
                          <span aria-hidden>—</span>
                        </td>
                      );
                    }

                    const isSelected = selectedPermissions.includes(cell.name);

                    return (
                      <td
                        key={`${resource}-${verb}`}
                        className={[
                          "px-1 lg:px-2 py-1 lg:py-2 text-center",
                          isSelected ? "bg-primary-soft/40" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="flex justify-center">
                          <Checkbox
                            aria-label={labelPermission(cell.name)}
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() => handleCellToggle(cell.name)}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
      </table>
    </div>
  );
}
