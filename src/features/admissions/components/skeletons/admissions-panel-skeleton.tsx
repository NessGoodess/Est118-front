import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton genérico para paneles de admisiones (ajustes, proceso, asignación). */
export default function AdmissionsPanelSkeleton({
  label = "Cargando sección",
  showPageHeader = true,
  cards = 2,
  rowsPerCard = 4,
  showActions = true,
}: {
  label?: string;
  showPageHeader?: boolean;
  cards?: number;
  rowsPerCard?: number;
  showActions?: boolean;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      {showPageHeader ? (
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-60 max-w-full" />
          <SkeletonBone className="h-4 w-96 max-w-full bg-surface-muted/80" />
        </div>
      ) : null}

      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} className="space-y-4 p-4 md:p-6">
          <div className="space-y-2">
            <SkeletonBone className="h-5 w-48 max-w-full" />
            <SkeletonBone className="h-3 w-72 max-w-full bg-surface-muted/80" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: rowsPerCard }).map((__, j) => (
              <SkeletonBone key={j} className="h-12 w-full" />
            ))}
          </div>
        </SkeletonCard>
      ))}

      {showActions ? (
        <div className="flex justify-end gap-3">
          <SkeletonBone className="h-10 w-28" />
          <SkeletonBone className="h-10 w-40" />
        </div>
      ) : null}
    </div>
  );
}
