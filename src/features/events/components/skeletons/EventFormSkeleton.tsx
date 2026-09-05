import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

export default function EventFormSkeleton({
  label = "Cargando formulario de evento",
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
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBone key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4 px-6 py-7 md:px-8">
          <SkeletonBone className="h-24 w-full" />
          <SkeletonBone className="h-40 w-full rounded-xl" />
        </div>
        <div className="flex items-center justify-end gap-3 bg-surface-muted px-6 py-5 md:px-8">
          <SkeletonBone className="h-10 w-24" />
          <SkeletonBone className="h-10 w-40" />
        </div>
      </SkeletonCard>
    </div>
  )
}
