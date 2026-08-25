import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton";

function CycleRowSkeleton() {
  return (
    <li className="flex flex-wrap items-center gap-4 border-l-4 border-l-transparent bg-surface-elevated p-4">
      <div className="min-w-0 grow space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBone className="h-5 w-48 max-w-full" />
          <SkeletonBone className="h-5 w-16 rounded-md" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBone className="h-7 w-36 rounded-md" />
          <SkeletonBone className="h-3 w-3" />
          <SkeletonBone className="h-7 w-36 rounded-md" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SkeletonBone className="h-3 w-24" />
          <SkeletonBone className="h-3 w-28" />
        </div>
      </div>
      <div className="flex grow flex-wrap justify-end gap-2">
        <SkeletonBone className="h-8 w-20" />
        <SkeletonBone className="h-8 w-24" />
      </div>
    </li>
  );
}

/** Skeleton de /admissions/process — Periodos de registro. */
export default function AdmissionCyclesSkeleton({
  label = "Cargando periodos de registro",
  rows = 4,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label={label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-56 max-w-full" />
          <SkeletonBone className="h-4 w-96 max-w-full bg-surface-muted/80" />
        </div>
        <SkeletonBone className="h-9 w-36 shrink-0" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0">
          <SkeletonCard className="space-y-3 p-6">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1.5">
                <SkeletonBone className="h-4 w-40" />
                <SkeletonBone className="h-3 w-56 bg-surface-muted/80" />
              </div>
              <SkeletonBone className="h-3 w-20" />
            </div>

            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {Array.from({ length: rows }).map((_, i) => (
                <CycleRowSkeleton key={i} />
              ))}
            </ul>
          </SkeletonCard>
        </section>

        <aside className="min-w-0 space-y-4">
          <SkeletonCard className="space-y-3 p-4">
            <SkeletonBone className="h-4 w-40" />
            <SkeletonBone className="h-3 w-full" />
            <SkeletonBone className="h-3 w-48 max-w-full" />
            <SkeletonBone className="h-3 w-56 max-w-full" />
          </SkeletonCard>
          <SkeletonCard className="space-y-3 p-4">
            <SkeletonBone className="h-4 w-44" />
            <SkeletonBone className="h-3 w-full" />
            <SkeletonBone className="h-3 w-full" />
            <SkeletonBone className="h-3 w-40 max-w-full" />
            <SkeletonBone className="h-3 w-52 max-w-full" />
          </SkeletonCard>
          <SkeletonCard className="space-y-3 p-4">
            <SkeletonBone className="h-4 w-32" />
            <SkeletonBone className="h-3 w-full" />
            <SkeletonBone className="h-3 w-44 max-w-full" />
          </SkeletonCard>
        </aside>
      </div>
    </div>
  );
}
