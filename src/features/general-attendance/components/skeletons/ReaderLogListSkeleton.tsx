import { SkeletonBone } from '@/components/ui/skeleton/SectionSkeleton';

/** Matches ReaderLogList card feed (header + rows). */
export default function ReaderLogListSkeleton({
  rows = 5,
}: {
  rows?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-2xl"
      aria-busy="true"
      aria-label="Cargando lecturas recientes"
    >
      <div className="border-b border-border bg-gradient-to-r from-surface-muted to-primary-soft px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <SkeletonBone className="h-6 w-44" />
          <SkeletonBone className="h-6 w-8 rounded-full" />
        </div>
        <SkeletonBone className="mt-2 h-4 w-64 max-w-full" />
      </div>

      <div className="animate-pulse space-y-2 p-2 lg:p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated p-2 shadow-md lg:p-3"
          >
            <SkeletonBone className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBone className="h-5 w-48 max-w-full" />
              <div className="flex flex-wrap gap-2">
                <SkeletonBone className="h-5 w-20 rounded-full" />
                <SkeletonBone className="h-5 w-24 rounded-full" />
                <SkeletonBone className="h-5 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
