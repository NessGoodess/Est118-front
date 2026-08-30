import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Skeleton de /Announcement/create y /Announcement/[id]/edit. */
export default function AnnouncementFormSkeleton({
  label = "Cargando formulario de aviso",
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
        <div className="flex flex-wrap gap-2">
          <SkeletonBone className="h-10 w-32" />
          <SkeletonBone className="h-10 w-28" />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SkeletonCard className="divide-y divide-border overflow-hidden p-0">
          {Array.from({ length: 4 }).map((_, section) => (
            <div key={section} className="space-y-4 px-6 py-7 md:px-8">
              <div className="mb-2 flex items-start gap-3">
                <SkeletonBone className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="space-y-2">
                  <SkeletonBone className="h-4 w-40" />
                  <SkeletonBone className="h-3 w-64 max-w-full bg-surface-muted/80" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonBone className="h-12 w-full" />
                <SkeletonBone className="h-12 w-full" />
                <SkeletonBone className="h-12 w-full" />
                <SkeletonBone className="h-12 w-full" />
              </div>
              {section === 2 ? (
                <SkeletonBone className="h-36 w-full rounded-xl" />
              ) : null}
            </div>
          ))}
          <div className="flex items-center justify-end gap-3 bg-surface-muted px-6 py-5 md:px-8">
            <SkeletonBone className="h-10 w-24" />
            <SkeletonBone className="h-10 w-40" />
          </div>
        </SkeletonCard>

        <div className="hidden space-y-3 lg:sticky lg:top-24 lg:block">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="space-y-3 p-5">
              <SkeletonBone className="h-4 w-28" />
              <SkeletonBone className="h-3 w-full bg-surface-muted/80" />
              <SkeletonBone className="h-3 w-5/6 bg-surface-muted/80" />
              <SkeletonBone className="h-3 w-full bg-surface-muted/80" />
              <SkeletonBone className="mt-2 h-3 w-4/5 bg-surface-muted/80" />
              <SkeletonBone className="h-3 w-full bg-surface-muted/80" />
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  )
}
