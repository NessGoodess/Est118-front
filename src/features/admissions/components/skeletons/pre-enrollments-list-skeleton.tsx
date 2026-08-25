import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton de /admissions/applications: header + ciclos + tabla. */
export default function PreEnrollmentsListSkeleton({
  label = "Cargando preinscripciones",
  cycles = 3,
  rows = 10,
}: {
  label?: string;
  cycles?: number;
  rows?: number;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-52 max-w-full" />
          <SkeletonBone className="h-4 w-72 max-w-full bg-surface-muted/80" />
        </div>
        <SkeletonBone className="h-9 w-36 shrink-0" />
      </div>

      <div className="flex gap-3 overflow-hidden px-2 py-1">
        {Array.from({ length: cycles }).map((_, i) => (
          <SkeletonCard
            key={i}
            className="min-w-[20rem] max-w-lg shrink-0 space-y-3 px-5 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <SkeletonBone className="h-4 w-36" />
                <SkeletonBone className="h-3 w-24 bg-surface-muted/80" />
              </div>
              <SkeletonBone className="h-6 w-20 rounded-full" />
            </div>
            <div className="border-t border-border" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((__, j) => (
                <div key={j} className="space-y-1.5">
                  <SkeletonBone className="h-2.5 w-16 bg-surface-muted/80" />
                  <SkeletonBone className="h-4 w-14" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <SkeletonBone className="h-2.5 w-20 bg-surface-muted/80" />
              <SkeletonBone className="h-3 w-12" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      <SkeletonCard className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SkeletonBone className="h-10 w-full max-w-sm" />
          <div className="flex gap-2">
            <SkeletonBone className="h-10 w-28" />
            <SkeletonBone className="h-10 w-10 md:w-28" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex gap-4 border-b border-border bg-surface-muted px-3 py-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonBone
                key={i}
                className={`h-4 w-24 shrink-0 ${i > 2 ? "hidden md:block" : ""}`}
              />
            ))}
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 px-3 py-3">
                {Array.from({ length: 8 }).map((__, j) => (
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
  );
}
