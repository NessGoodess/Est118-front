"use client";

import { useState } from "react";
import type { UserDetail } from "@/features/users/types/users";
import {
  deleteUser,
  resendVerification,
} from "@/features/users/services/users.service";
import { useUserCapabilities } from "@/features/users/hooks/capabilities/useUserCapabilities";
import { useConfirm } from "@/components/ui/confirm/useConfirm";
import { globalToast } from "@/lib/toast";
import { ApiError } from "@/lib/types/auth";
import { formatError } from "@/lib/api";
import UserDetailHeader from "./UserDetailHeader";
import UserDetailAccountCard from "./UserDetailAccountCard";
import UserDetailRolesCard from "./UserDetailRolesCard";
import UserDetailPermissionsCard from "./UserDetailPermissionsCard";

interface UserDetailViewProps {
  user: UserDetail;
  onDelete?: () => void;
}

export default function UserDetailView({ user, onDelete }: UserDetailViewProps) {
  const { canEdit, canDelete } = useUserCapabilities();
  const { confirm } = useConfirm();
  const [resending, setResending] = useState(false);

  const handleDelete = () => {
    confirm({
      title: "Eliminar usuario",
      description: `¿Seguro que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`,
      variant: "danger",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: async () => {
        try {
          await deleteUser(user.id);
          globalToast.success("Usuario eliminado exitosamente");
          onDelete?.();
        } catch (error) {
          globalToast.error(formatError(error as ApiError));
        }
      },
    });
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerification(user.id);
      globalToast.success("Email de verificación enviado");
    } catch (error) {
      globalToast.error(formatError(error as ApiError));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <UserDetailHeader
        user={user}
        canEdit={canEdit}
        canDelete={canDelete}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UserDetailAccountCard
          user={user}
          canEdit={canEdit}
          resending={resending}
          onResendVerification={handleResendVerification}
        />
        <UserDetailRolesCard roles={user.roles} />
        <UserDetailPermissionsCard permissions={user.permissions} />
      </div>
    </div>
  );
}
