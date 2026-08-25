import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

function SectionSkeletonBlock({ fields = 6 }: { fields?: number }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <SkeletonBone className="h-4 w-4" />
        <SkeletonBone className="h-4 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonBone className="h-2.5 w-20 bg-surface-muted/80" />
            <SkeletonBone className="h-4 w-32 max-w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Skeleton del detalle de preinscripción: encabezado + secciones en dos columnas. */
export default function PreEnrollmentDetailSkeleton({
  label = "Cargando preinscripción",
  showPageHeader = false,
  showProcessPanel = true,
}: {
  label?: string;
  /** Incluye las líneas del GenericHeader de la página completa */
  showPageHeader?: boolean;
  showProcessPanel?: boolean;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      {showPageHeader ? (
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-56 max-w-full" />
          <SkeletonBone className="h-4 w-72 max-w-full bg-surface-muted/80" />
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <SkeletonBone className="h-6 w-56 max-w-full" />
            <SkeletonBone className="h-4 w-32" />
            <div className="flex gap-2 pt-1">
              <SkeletonBone className="h-6 w-24 rounded-md" />
              <SkeletonBone className="h-6 w-28 rounded-md" />
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <SkeletonBone className="h-9 w-24" />
            <SkeletonBone className="h-9 w-32" />
          </div>
        </div>
      </div>

      {showProcessPanel ? (
        <div className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm md:p-6">
          <SkeletonBone className="h-4 w-44" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SkeletonBone className="h-11 w-full" />
            <SkeletonBone className="h-11 w-full" />
            <SkeletonBone className="h-11 w-full" />
          </div>
          <div className="flex justify-end">
            <SkeletonBone className="h-9 w-32" />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 rounded-lg bg-surface-elevated p-4 lg:grid-cols-2">
        <div className="space-y-8">
          <SectionSkeletonBlock fields={8} />
          <SectionSkeletonBlock fields={4} />
          <SectionSkeletonBlock fields={2} />
        </div>
        <div className="space-y-8">
          <SectionSkeletonBlock fields={4} />
          <SectionSkeletonBlock fields={6} />
          <SectionSkeletonBlock fields={2} />
        </div>
      </div>
    </div>
  );
}
