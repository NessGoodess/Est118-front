"use client";

import { use, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  UserDetailView,
  useUserDetail,
} from "@/features/users";
import UserDetailSkeleton from "@/features/users/components/detail/UserDetailSkeleton";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { globalToast } from "@/lib/toast";
import { notifyUsersListChanged } from "@/features/users/lib/usersListEvents";
import UserDetailLoading from "./loading";

function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, error, refetch } = useUserDetail(id);
  const skipPathRefetch = useRef(true);

  useEffect(() => {
    if (error) {
      globalToast.error(error.message);
      router.replace("/users");
    }
  }, [error, router]);

  // Al volver de /edit o /password, refrescar detalle
  useEffect(() => {
    if (pathname !== `/users/${id}`) return;
    if (skipPathRefetch.current) {
      skipPathRefetch.current = false;
      return;
    }
    void refetch();
  }, [pathname, id, refetch]);

  if (isLoading && !user) {
    return <UserDetailSkeleton showPageHeader />;
  }

  if (!user) {
    return (
      <p className="py-12 text-center text-fg-muted">Usuario no encontrado</p>
    );
  }

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Detalle de usuario"
        description="Consulta y gestiona la información del usuario"
      />
      <UserDetailView
        user={user}
        onDelete={() => {
          notifyUsersListChanged();
          router.replace("/users");
        }}
      />
    </div>
  );
}

export default withPagePermission(UserDetailPage, {
  loadingComponent: <UserDetailLoading />,
});
