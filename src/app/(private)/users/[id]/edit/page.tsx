"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditUserForm, useUserDetail } from "@/features/users";
import UserFormSkeleton from "@/features/users/components/shared/UserFormSkeleton";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { globalToast } from "@/lib/toast";
import EditUserLoading from "./loading";

function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading, error } = useUserDetail(id);

  useEffect(() => {
    if (error) {
      globalToast.error(error.message);
      router.replace("/users");
    }
  }, [error, router]);

  const goToDetail = () => router.push(`/users/${id}`);
  const cancel = () => router.back();

  if (isLoading && !user) {
    return <UserFormSkeleton label="Cargando edición de usuario" />;
  }

  if (!user) {
    return (
      <div className="py-12 text-center text-fg-muted">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Editar usuario"
        description={`Actualiza los datos de ${user.name}`}
      />
      <EditUserForm
        user={user}
        onSuccess={goToDetail}
        onCancel={cancel}
      />
    </div>
  );
}

export default withPagePermission(EditUserPage, {
  loadingComponent: <EditUserLoading />,
});
