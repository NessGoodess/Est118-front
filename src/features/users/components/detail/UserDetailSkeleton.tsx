import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton del detalle estilo perfil (header + grid). */
export default function UserDetailSkeleton({
  label = "Cargando usuario",
  showPageHeader = false,
}: {
  label?: string;
  /** Incluye filas del GenericHeader de la página */
  showPageHeader?: boolean;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      {showPageHeader ? (
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-48 max-w-full" />
          <SkeletonBone className="h-4 w-72 max-w-full bg-surface-muted/80" />
        </div>
      ) : null}

      {/* Profile hero */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-card">
        <div
          className="absolute inset-x-0 top-0 h-20 bg-surface-muted md:h-24"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 p-4 pt-10 sm:flex-row sm:items-end sm:justify-between sm:p-6 sm:pt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <SkeletonBone className="h-20 w-20 rounded-2xl md:h-24 md:w-24" />
            <div className="space-y-2 pb-1">
              <SkeletonBone className="h-7 w-44" />
              <SkeletonBone className="h-4 w-56" />
              <div className="flex gap-2 pt-1">
                <SkeletonBone className="h-5 w-20" />
                <SkeletonBone className="h-5 w-16" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonBone className="h-8 w-20" />
            <SkeletonBone className="h-8 w-24" />
            <SkeletonBone className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 md:p-5">
          <SkeletonBone className="h-3 w-16" />
          <SkeletonBone className="h-4 w-40" />
          <SkeletonBone className="h-4 w-52" />
          <SkeletonBone className="h-4 w-36" />
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 md:p-5">
          <SkeletonBone className="h-3 w-14" />
          <div className="flex flex-wrap gap-2">
            <SkeletonBone className="h-7 w-24" />
            <SkeletonBone className="h-7 w-28" />
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 md:col-span-2 md:p-5">
          <SkeletonBone className="h-3 w-28" />
          <div className="flex flex-wrap gap-2">
            <SkeletonBone className="h-6 w-28" />
            <SkeletonBone className="h-6 w-32" />
            <SkeletonBone className="h-6 w-24" />
            <SkeletonBone className="h-6 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
