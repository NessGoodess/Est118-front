"use client";

import { useRouter } from "next/navigation";
import type { UserDetail } from "@/features/users/types/users";
import { IconByName } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { labelRole } from "@/features/users/utils/permissionLabels";
import { getInitials } from "./utils/getInitials";

type UserDetailHeaderProps = {
  user: UserDetail;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: () => void;
};

export default function UserDetailHeader({
  user,
  canEdit,
  canDelete,
  onDelete,
}: UserDetailHeaderProps) {
  const router = useRouter();
  const isVerified = Boolean(user.email_verified_at);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-card">
      <div
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-primary/20 via-primary-soft to-surface-muted md:h-24"
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 p-4 pt-10 sm:flex-row sm:items-end sm:justify-between sm:p-6 sm:pt-12">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-surface-elevated bg-primary text-2xl font-semibold tracking-wide text-primary-foreground shadow-card md:h-24 md:w-24 md:text-3xl"
            aria-hidden
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 pb-0.5">
            <h3 className="truncate text-xl font-semibold text-foreground md:text-2xl">
              {user.name}
            </h3>
            <a
              href={`mailto:${user.email}`}
              className="mt-0.5 block truncate text-sm text-fg-muted transition-colors hover:text-primary"
            >
              {user.email}
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  <IconByName name="check" className="h-3 w-3" />
                  Verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning-foreground">
                  <IconByName name="alert" className="h-3 w-3" />
                  No verificado
                </span>
              )}
              {user.roles?.[0] ? (
                <span className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  {labelRole(user.roles[0].name)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {canEdit ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => router.replace(`/users/${user.id}/edit`)}
            >
              Editar
            </Button>
          ) : null}
          {canEdit ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => router.replace(`/users/${user.id}/password`)}
            >
              Contraseña
            </Button>
          ) : null}
          {canDelete ? (
            <Button type="button" size="sm" variant="danger" onClick={onDelete}>
              Eliminar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
