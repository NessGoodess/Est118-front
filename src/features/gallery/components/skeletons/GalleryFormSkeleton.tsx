import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Skeleton de /Gallery/create y /Gallery/[id]/edit. */
export default function GalleryFormSkeleton({
  label = "Cargando formulario de galería",
}: {
  label?: string
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-48 max-w-full" />
          <SkeletonBone className="h-4 w-80 max-w-full bg-surface-muted/80" />
        </div>
        <SkeletonBone className="h-10 w-36" />
      </div>

      <SkeletonCard className="divide-y divide-border overflow-hidden p-0">
        <div className="space-y-4 px-6 py-7 md:px-8">
          <div className="mb-2 flex items-start gap-3">
            <SkeletonBone className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <SkeletonBone className="h-4 w-40" />
              <SkeletonBone className="h-3 w-64 max-w-full bg-surface-muted/80" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBone key={i} className="h-12 w-full" />
            ))}
          </div>
          <SkeletonBone className="h-12 w-full" />
        </div>

        <div className="space-y-4 px-6 py-7 md:px-8">
          <div className="mb-2 flex items-start gap-3">
            <SkeletonBone className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <SkeletonBone className="h-4 w-40" />
              <SkeletonBone className="h-3 w-72 max-w-full bg-surface-muted/80" />
            </div>
          </div>
          <SkeletonBone className="h-32 w-full rounded-xl" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBone key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 bg-surface-muted px-6 py-5 md:px-8">
          <SkeletonBone className="h-10 w-24" />
          <SkeletonBone className="h-10 w-40" />
        </div>
      </SkeletonCard>
    </div>
  )
}
