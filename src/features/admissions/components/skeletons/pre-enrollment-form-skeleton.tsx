import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

function FieldsetSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-border bg-surface-elevated p-4 shadow-card">
      <div className="flex items-center gap-2">
        <SkeletonBone className="h-4 w-4" />
        <SkeletonBone className="h-4 w-44" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <SkeletonBone key={i} className="h-12 w-full" />
        ))}
      </div>
    </fieldset>
  );
}

/** Skeleton de los formularios de preinscripción (crear por pestañas / editar). */
export default function PreEnrollmentFormSkeleton({
  label = "Cargando formulario de preinscripción",
  showPageHeader = false,
  showTabs = false,
  sections = 3,
}: {
  label?: string;
  /** Incluye las líneas del GenericHeader de la página completa */
  showPageHeader?: boolean;
  /** Barra de pestañas del alta pública/privada */
  showTabs?: boolean;
  sections?: number;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      {showPageHeader ? (
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-64 max-w-full" />
          <SkeletonBone className="h-4 w-80 max-w-full bg-surface-muted/80" />
        </div>
      ) : null}

      {showTabs ? (
        <div className="flex gap-2 overflow-hidden border-b border-border pb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBone key={i} className="h-9 w-28 shrink-0" />
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        {Array.from({ length: sections }).map((_, i) => (
          <FieldsetSkeleton key={i} fields={i === 0 ? 4 : 6} />
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <SkeletonBone className="h-10 w-28" />
        <SkeletonBone className="h-10 w-40" />
      </div>
    </div>
  );
}
