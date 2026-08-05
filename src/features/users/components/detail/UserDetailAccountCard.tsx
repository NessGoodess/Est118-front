"use client";

import type { UserDetail } from "@/features/users/types/users";
import { formatLongWithoutTime } from "@/lib/utils/dateFormatter";

type UserDetailAccountCardProps = {
  user: UserDetail;
  canEdit: boolean;
  resending: boolean;
  onResendVerification: () => void;
};

export default function UserDetailAccountCard({
  user,
  canEdit,
  resending,
  onResendVerification,
}: UserDetailAccountCardProps) {
  const isVerified = Boolean(user.email_verified_at);

  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-4 shadow-card md:p-5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
        Cuenta
      </h4>
      <dl className="mt-3 space-y-3">
        <div>
          <dt className="text-xs text-fg-muted">Correo</dt>
          <dd className="mt-0.5 break-all text-sm font-medium text-foreground">
            {user.email}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">Verificación</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            {isVerified ? (
              <span className="text-sm text-success">
                Verificado
                {user.email_verified_at
                  ? ` · ${formatLongWithoutTime(user.email_verified_at)}`
                  : null}
              </span>
            ) : (
              <>
                <span className="text-sm text-warning-foreground">Pendiente</span>
                {canEdit ? (
                  <button
                    type="button"
                    disabled={resending}
                    onClick={onResendVerification}
                    className="text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-50"
                  >
                    {resending ? "Enviando…" : "Reenviar verificación"}
                  </button>
                ) : null}
              </>
            )}
          </dd>
        </div>
        {user.created_at ? (
          <div>
            <dt className="text-xs text-fg-muted">Alta</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {formatLongWithoutTime(user.created_at)}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
