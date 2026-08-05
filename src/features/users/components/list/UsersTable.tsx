"use client";

import { useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { usersTableConfig } from "./users.config";
import { tableRenderers } from "./tableRerenders";
import { tableIcons } from "./icons";
import useUsers, {
  type UsersListFilters,
} from "@/features/users/hooks/list/useUsers";
import { useUserCapabilities } from "@/features/users/hooks/capabilities/useUserCapabilities";
import { filterActionsByPermission } from "@/lib/utils/tablePermissions";
import { subscribeUsersListChanged } from "@/features/users/lib/usersListEvents";
import { globalToast } from "@/lib/toast";

type UsersTableProps = {
  filters: UsersListFilters;
};

export default function UsersTable({ filters }: UsersTableProps) {
  const { users, isLoading, error, refetch } = useUsers(filters);
  const { can, canList } = useUserCapabilities();

  useEffect(() => {
    if (error) globalToast.error(error.message);
  }, [error]);

  useEffect(() => subscribeUsersListChanged(() => void refetch()), [refetch]);

  const tableConfig = useMemo(() => {
    const actions = filterActionsByPermission(usersTableConfig.actions, can);
    return {
      ...usersTableConfig,
      actions,
      features: {
        ...usersTableConfig.features,
        rowClickable:
          canList && Boolean(usersTableConfig.features?.rowClickable),
        rowClickRoute: canList
          ? usersTableConfig.features?.rowClickRoute
          : undefined,
      },
    };
  }, [can, canList]);

  return (
    <DataTable
      config={tableConfig}
      data={users}
      renderers={tableRenderers}
      icons={tableIcons}
      loading={isLoading}
      emptyMessage="No se encontraron usuarios"
      minRows={10}
    />
  );
}
