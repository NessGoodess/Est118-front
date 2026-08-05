"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChangePasswordForm, useUserDetail } from "@/features/users";
import UserDetailSkeleton from "@/features/users/components/detail/UserDetailSkeleton";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { globalToast } from "@/lib/toast";
import PasswordUserLoading from "./loading";

function ChangePasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading, error, userId } = useUserDetail(id);

  useEffect(() => {
    if (error) {
      globalToast.error(error.message);
      router.replace("/users");
    }
  }, [error, router]);

  const goToDetail = () => router.push(`/users/${id}`);

  if (isLoading && !user) {
    return <UserDetailSkeleton label="Cargando cambio de contraseña" />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <GenericHeader
        title="Cambiar contraseña"
        description={`Nueva contraseña para ${user.name}`}
      />
      <div className="mx-auto max-w-lg rounded-lg border border-border bg-surface-elevated p-6 shadow-sm">
        <ChangePasswordForm
          userId={userId}
          onSuccess={goToDetail}
          onCancel={goToDetail}
        />
      </div>
    </div>
  );
}

export default withPagePermission(ChangePasswordPage, {
  loadingComponent: <PasswordUserLoading />,
});
