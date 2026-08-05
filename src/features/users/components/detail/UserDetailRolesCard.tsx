import type { UserDetail } from "@/features/users/types/users";
import { labelRole } from "@/features/users/utils/permissionLabels";

type UserDetailRolesCardProps = {
  roles: UserDetail["roles"];
};

export default function UserDetailRolesCard({ roles }: UserDetailRolesCardProps) {
  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-4 shadow-card md:p-5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
        Roles
      </h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {roles?.length ? (
          roles.map((role) => (
            <span
              key={role.id}
              className="inline-flex items-center rounded-md border border-border bg-surface-muted px-2.5 py-1 text-sm font-medium text-foreground"
            >
              {labelRole(role.name)}
            </span>
          ))
        ) : (
          <p className="text-sm text-fg-muted">Sin roles asignados</p>
        )}
      </div>
    </section>
  );
}
