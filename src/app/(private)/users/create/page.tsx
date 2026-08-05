"use client";

import { useRouter } from "next/navigation";
import { RegisterUserForm } from "@/features/users";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { notifyUsersListChanged } from "@/features/users/lib/usersListEvents";
import CreateUserLoading from "./loading";

function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Crear nuevo usuario"
        description="Registra un usuario y asígnale roles y permisos"
      />
      <RegisterUserForm
        onSuccess={() => {
          notifyUsersListChanged();
          router.replace("/users");
        }}
        onCancel={() => router.back()}
      />
    </div>
  );
}

export default withPagePermission(CreateUserPage, {
  loadingComponent: <CreateUserLoading />,
});
