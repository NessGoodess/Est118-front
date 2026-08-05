"use client";

import { use, useEffect } from "react";
import {
  RegisterUserForm,
  UserDetailView,
  useUserDetail,
} from "@/features/users";
import UsersRouteModal, {
  useCancelUsersModal,
  useCloseUsersModal,
  useCloseUsersModalAndRefreshList,
} from "@/features/users/components/modal/UsersRouteModal";
import UserDetailSkeleton from "@/features/users/components/detail/UserDetailSkeleton";
import { globalToast } from "@/lib/toast";

/**
 * Soft-nav a /users/[id].
 * Nota: a veces Next matchea "create" aquí en vez de (.)create → fallback a crear.
 */
export default function ViewUserModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const close = useCloseUsersModal();
  const closeAndRefresh = useCloseUsersModalAndRefreshList();
  const cancel = useCancelUsersModal();
  const isCreate = id === "create";
  const numericId = Number.parseInt(id, 10);
  const isNumericId = !Number.isNaN(numericId);

  const { user, isLoading, error } = useUserDetail(
    isCreate || !isNumericId ? null : id
  );

  useEffect(() => {
    if (isCreate || !isNumericId) return;
    if (!error) return;
    globalToast.error(error.message);
    close();
  }, [error, close, isCreate, isNumericId]);

  if (isCreate) {
    return (
      <UsersRouteModal title="Crear usuario" maxWidth="6xl" reopenKey="create">
        <RegisterUserForm onSuccess={closeAndRefresh} onCancel={cancel} />
      </UsersRouteModal>
    );
  }

  if (!isNumericId) {
    return (
      <UsersRouteModal
        title="Usuario"
        maxWidth="6xl"
        reopenKey={`invalid-${id}`}
      >
        <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
      </UsersRouteModal>
    );
  }

  return (
    <UsersRouteModal
      title="Detalles del usuario"
      maxWidth="6xl"
      reopenKey={`view-${id}`}
    > 
      {isLoading && !user ? (
        <UserDetailSkeleton label="Cargando usuario" />
      ) : user ? (
        <UserDetailView user={user} onDelete={closeAndRefresh} />
      ) : (
        <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
      )}
    </UsersRouteModal>
  );
}
