import SectionSkeleton, {
  SkeletonBone,
  SkeletonCard,
} from "@/components/ui/skeleton/SectionSkeleton";

/** Mirrors StudentsDashboardSection layout for route + in-section loading. */
export default function StudentsDashboardSectionSkeleton() {
  return (
    <SectionSkeleton label="Cargando estudiantes">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-stretch">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <SkeletonBone className="h-10 w-10 rounded-xl" />
                  <SkeletonBone className="h-7 w-14" />
                </div>
                <SkeletonBone className="h-3.5 w-24" />
                <SkeletonBone className="h-3 w-32 bg-surface-muted/80" />
              </SkeletonCard>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={i} className="space-y-3">
                <SkeletonBone className="h-10 w-10 rounded-xl" />
                <SkeletonBone className="h-4 w-28" />
                <SkeletonBone className="h-3 w-full max-w-[14rem] bg-surface-muted/80" />
              </SkeletonCard>
            ))}
          </div>
        </div>

        <SkeletonCard className="flex min-h-[14rem] flex-col gap-3 lg:min-h-0">
          <SkeletonBone className="h-3 w-20" />
          <div className="flex flex-1 flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface-muted/40 px-3 py-2.5"
              >
                <SkeletonBone className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SkeletonBone className="h-3.5 w-24" />
                  <SkeletonBone className="h-2.5 w-16 bg-surface-muted/80" />
                </div>
                <SkeletonBone className="h-6 w-10 shrink-0" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </SectionSkeleton>
  );
}
