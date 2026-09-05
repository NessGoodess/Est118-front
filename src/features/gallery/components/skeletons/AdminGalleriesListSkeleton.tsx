import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Skeleton de /Gallery: header + botón crear + tabla. */
export default function AdminGalleriesListSkeleton({
  label = "Cargando galerías",
  rows = 6,
}: {
  label?: string
  rows?: number
}) {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label={label}>
      <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBone className="h-8 w-32 max-w-full" />
          <SkeletonBone className="h-4 w-80 max-w-full bg-surface-muted/80" />
        </div>
        <SkeletonBone className="h-10 w-40 shrink-0 rounded-xl" />
      </div>

      <SkeletonCard className="space-y-3 p-4">
        <SkeletonBone className="h-10 w-full max-w-sm" />
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex gap-4 border-b border-border bg-surface-muted px-3 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBone
                key={i}
                className={`h-4 w-24 shrink-0 ${i > 2 ? "hidden md:block" : ""}`}
              />
            ))}
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 px-3 py-3">
                {Array.from({ length: 6 }).map((__, j) => (
                  <SkeletonBone
                    key={j}
                    className={`h-5 w-24 shrink-0 ${j > 2 ? "hidden md:block" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </SkeletonCard>
    </div>
  )
}
