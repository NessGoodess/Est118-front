import { EnhancedTableConfig } from "@/lib/types/data-table";
import type { UserListItem } from "@/features/users/types/users";
import { USER_PERMISSIONS } from "@/features/users/permissions";

export const usersTableConfig: EnhancedTableConfig<UserListItem> = {
  columns: [
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      searchable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      searchable: true,
      render: "email-link",
    },
    {
      key: "role_names",
      label: "Roles",
      sortable: false,
      searchable: true,
      render: "user-roles",
    },
    {
      key: "email_verified_at",
      label: "Estado",
      sortable: true,
      searchable: false,
      render: "user-verified",
    },
    {
      key: "created_at",
      label: "Fecha",
      sortable: true,
      searchable: false,
      render: "user-date",
    },
  ],
  actions: [
    {
      label: "",
      icon: "eye",
      variant: "secondary",
      permission: USER_PERMISSIONS.view,
      href: (user) => `/users/${user.id}`,
    },
  ],
  features: {
    rowClickable: true,
    rowClickRoute: (user) => `/users/${user.id}`,
    selectionEnabled: false,
  },
  itemsPerPage: 15,
  searchable: true,
  sortable: true,
  selectable: false,
};
