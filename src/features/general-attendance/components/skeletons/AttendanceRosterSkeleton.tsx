import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

/** Grid of student cards while the daily roster loads. */
export default function AttendanceRosterSkeleton({
  cards = 9,
}: {
  cards?: number;
}) {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label="Cargando asistencia"
    >
      <div className="grid animate-pulse grid-cols-2 gap-3 rounded-lg bg-surface-elevated p-3 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg p-2">
            <SkeletonBone className="mx-auto h-3 w-16" />
            <SkeletonBone className="mx-auto h-7 w-10" />
          </div>
        ))}
      </div>

      <div className="grid animate-pulse gap-4 rounded-lg bg-surface-elevated p-3 shadow-sm md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border bg-surface-elevated p-3 shadow-sm"
          >
            <SkeletonBone className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBone className="h-5 w-36 max-w-full" />
              <SkeletonBone className="h-4 w-24" />
              <div className="flex gap-2">
                <SkeletonBone className="h-5 w-16 rounded-full" />
                <SkeletonBone className="h-5 w-14 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
