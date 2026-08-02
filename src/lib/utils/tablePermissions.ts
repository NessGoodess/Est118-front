import type { TableAction } from "@/lib/types/data-table";

/** filter actions of the table according to the user's permissions */
export function filterActionsByPermission<T>(
  actions: TableAction<T>[] | undefined,
  hasPermission: (permission: string) => boolean
): TableAction<T>[] {
  return (actions ?? []).filter(
    (action) => !action.permission || hasPermission(action.permission)
  );
}
