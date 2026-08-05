import type { UserDetail } from "@/features/users/types/users";
import { labelPermission } from "@/features/users/utils/permissionLabels";

type UserDetailPermissionsCardProps = {
  permissions: UserDetail["permissions"];
};

export default function UserDetailPermissionsCard({
  permissions,
}: UserDetailPermissionsCardProps) {
  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-4 shadow-card md:col-span-2 md:p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          Permisos directos
        </h4>
        {permissions?.length ? (
          <span className="text-xs text-fg-muted">
            {permissions.length} asignado{permissions.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {permissions?.length ? (
          permissions.map((permission) => (
            <span
              key={permission.id}
              className="inline-flex items-center rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
            >
              {labelPermission(permission.name)}
            </span>
          ))
        ) : (
          <p className="text-sm text-fg-muted">
            Sin permisos directos (solo los del rol)
          </p>
        )}
      </div>
    </section>
  );
}
