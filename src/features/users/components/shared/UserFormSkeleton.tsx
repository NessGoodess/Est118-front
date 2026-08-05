import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";
import PermissionTableSkeleton from "@/features/users/components/shared/PermissionTableSkeleton";

/** Skeleton del layout SectionWrapper (create / edit usuario). */
export default function UserFormSkeleton({
  label = "Cargando formulario de usuario",
  showPasswordHints = false,
}: {
  label?: string;
  showPasswordHints?: boolean;
}) {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label={label}>
      <div className="space-y-2">
        <SkeletonBone className="h-7 w-56 max-w-full" />
        <SkeletonBone className="h-4 w-80 max-w-full bg-surface-muted/80" />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-6 lg:gap-4 2xl:grid-cols-12 2xl:gap-6">
        <fieldset className="col-span-2 space-y-3 rounded-lg border border-border bg-surface-elevated p-2 shadow-card 2xl:col-span-4 2xl:p-6">
          <SkeletonBone className="mb-2 h-4 w-28" />
          <SkeletonBone className="h-12 w-full" />
          <SkeletonBone className="h-12 w-full" />
          <SkeletonBone className="h-12 w-full" />
          {showPasswordHints ? (
            <>
              <SkeletonBone className="h-12 w-full" />
              <SkeletonBone className="h-12 w-full" />
            </>
          ) : null}
        </fieldset>

        <fieldset className="col-span-4 space-y-3 rounded-lg border border-border bg-surface-elevated p-2 shadow-card 2xl:col-span-8 2xl:p-6">
          {showPasswordHints ? (
            <SkeletonBone className="h-24 w-full rounded-lg" />
          ) : null}
          <PermissionTableSkeleton />
        </fieldset>
      </div>

      <div className="flex justify-end gap-3">
        <SkeletonBone className="h-10 w-24" />
        <SkeletonBone className="h-10 w-40" />
      </div>
    </div>
  );
}
