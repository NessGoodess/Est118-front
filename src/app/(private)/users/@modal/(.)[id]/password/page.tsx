"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChangePasswordForm, useUserDetail } from "@/features/users";
import UsersRouteModal, {
  useCancelUsersModal,
  useCloseUsersModal,
} from "@/features/users/components/modal/UsersRouteModal";
import PasswordFormSkeleton from "@/features/users/components/password/PasswordFormSkeleton";
import { globalToast } from "@/lib/toast";

export default function PasswordUserModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const close = useCloseUsersModal();
  const cancel = useCancelUsersModal();
  const { user, isLoading, error, userId } = useUserDetail(id);

  useEffect(() => {
    if (!error) return;
    globalToast.error(error.message);
    close();
  }, [error, close]);

  const onSuccess = () => router.push(`/users/${id}`);

  return (
    <UsersRouteModal
      title="Cambiar contraseña"
      maxWidth="lg"
      reopenKey={`password-${id}`}
    >
      {isLoading && !user ? (
        <PasswordFormSkeleton label="Cargando cambio de contraseña" />
      ) : user ? (
        <ChangePasswordForm
          userId={userId}
          onSuccess={onSuccess}
          onCancel={cancel}
        />
      ) : (
        <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
      )}
    </UsersRouteModal>
  );
}
