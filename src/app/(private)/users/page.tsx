"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UsersTable,
  UsersFilters,
  useUserCapabilities,
  type UsersListFilters,
} from "@/features/users";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { Button } from "@/components/ui/Button";
import UsersLoading from "./loading";

function UsersPage() {
  const router = useRouter();
  const { canCreate } = useUserCapabilities();
  const [filters, setFilters] = useState<UsersListFilters>({
    role: "",
    verified: undefined,
  });

  return (
    <div className="space-y-4">
      <GenericHeader
        title="Gestión de usuarios"
        description="Administra los usuarios del sistema"
      >
        {canCreate ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="shrink-0"
            onClick={() => router.push("/users/create")}
          >
            Crear usuario
          </Button>
        ) : null}
      </GenericHeader>
      <UsersFilters filters={filters} onChange={setFilters} />

      <UsersTable filters={filters} />
    </div>
  );
}

export default withPagePermission(UsersPage, {
  loadingComponent: <UsersLoading />,
});
