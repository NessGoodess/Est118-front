import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton";
/** Skeleton de /users: header + filtros + tabla. */
export default function UsersLoading() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="Cargando usuarios"
    >
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="space-y-2">
          <SkeletonBone className="h-7 w-42" />
          <SkeletonBone className="h-4 min-w-46 max-w-full" />
        </div>
        <div className="flex flex-wrap justify-end">
          <SkeletonBone className="h-8 w-32 shrink-0" />
        </div>
      </div>

      <div className="flex w-full flex-wrap justify-end gap-2">
        <SkeletonBone className="h-8 w-40" />
        <SkeletonBone className="h-8 w-40" />
      </div>

      <SkeletonCard className="space-y-3 p-4">
        <SkeletonBone className="h-10 w-full max-w-sm" />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBone key={i} className="h-12 w-full" />
        ))}
      </SkeletonCard>
    </div>
  );
}
