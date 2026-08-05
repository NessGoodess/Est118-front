"use client";

import { use, useEffect } from "react";
import { EditUserForm, useUserDetail } from "@/features/users";
import UsersRouteModal, {
  useCancelUsersModal,
  useCloseUsersModal,
} from "@/features/users/components/modal/UsersRouteModal";
import UserFormSkeleton from "@/features/users/components/shared/UserFormSkeleton";
import { globalToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function EditUserModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const close = useCloseUsersModal();
  const cancel = useCancelUsersModal();
  const { user, isLoading, error } = useUserDetail(id);

  useEffect(() => {
    if (!error) return;
    globalToast.error(error.message);
    close();
  }, [error, close]);

  // Tras guardar: volver al detalle (reabre modal ver)
  const onSuccess = () => router.push(`/users/${id}`);

  return (
    <UsersRouteModal
      title="Editar usuario"
      maxWidth="6xl"
      reopenKey={`edit-${id}`}
    >
      {isLoading && !user ? (
        <UserFormSkeleton label="Cargando edición de usuario" />
      ) : user ? (
        <EditUserForm
          user={user}
          onSuccess={onSuccess}
          onCancel={cancel}
        />
      ) : (
        <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
      )}
    </UsersRouteModal>
  );
}
