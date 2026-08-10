import GenericHeaderSkeleton from '@/components/ui/skeleton/GenericHeaderSkeleton';
import { SkeletonBone } from '@/components/ui/skeleton/SectionSkeleton';
import ReaderPanelGridSkeleton from '@/features/general-attendance/components/skeletons/ReaderPanelGridSkeleton';
import ReaderLogListSkeleton from '@/features/general-attendance/components/skeletons/ReaderLogListSkeleton';

/**
 * Route loading shell: header + tabs + live tab content skeletons.
 */
export default function Loading() {
  return (
    <section
      className="space-y-2 lg:space-y-4 2xl:space-y-6"
      aria-busy="true"
      aria-label="Cargando asistencia general"
    >
      <GenericHeaderSkeleton showChildren showBottom={false} />

      <div className="rounded-lg">
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-6">
          <nav
            className="flex min-w-max gap-4 rounded-xl border border-border bg-surface-elevated p-2 shadow-sm sm:gap-6"
            aria-hidden
          >
            <SkeletonBone className="h-9 w-40 rounded-lg" />
            <SkeletonBone className="h-9 w-44 rounded-lg" />
            <SkeletonBone className="h-9 w-36 rounded-lg" />
          </nav>
        </div>

        <div className="space-y-4 pt-4 2xl:space-y-6">
          <div className="flex justify-end">
            <SkeletonBone className="h-8 w-36 rounded-lg" />
          </div>
          <ReaderPanelGridSkeleton />
          <ReaderLogListSkeleton />
        </div>
      </div>
    </section>
  );
}
