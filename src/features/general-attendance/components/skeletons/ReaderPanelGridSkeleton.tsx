'use client';

import { SkeletonBone } from '@/components/ui/skeleton/SectionSkeleton';

/** Ops-panel shape: header bar + square photo + text + footer action. */
export default function ReaderPanelGridSkeleton({
  count = 2,
}: {
  count?: number;
}) {
  return (
    <div
      className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
      aria-busy="true"
      aria-label="Cargando paneles de lectores"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-[min(52vh,480px)] flex-col overflow-hidden rounded-2xl border-4 border-border bg-nfc-panel shadow-lg"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-nfc-panel-title-fg/20 bg-nfc-panel-title px-4 py-3">
            <div className="space-y-2">
              <SkeletonBone className="h-4 w-28 bg-nfc-panel-title-fg/25" />
              <SkeletonBone className="h-3 w-14 bg-nfc-panel-title-fg/15" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBone className="h-2.5 w-2.5 rounded-full bg-nfc-panel-title-fg/30" />
              <SkeletonBone className="h-3 w-16 bg-nfc-panel-title-fg/20" />
              <SkeletonBone className="h-4 w-4 rounded bg-nfc-panel-title-fg/20" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-stretch gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
              <SkeletonBone className="aspect-square h-auto w-full max-w-[min(100%,280px)] rounded-full" />
            </div>
            <div className="flex shrink-0 flex-col justify-center gap-2 text-center sm:w-40 sm:text-left">
              <SkeletonBone className="mx-auto h-6 w-40 sm:mx-0" />
              <SkeletonBone className="mx-auto h-4 w-28 sm:mx-0" />
              <SkeletonBone className="mx-auto h-7 w-32 rounded-lg sm:mx-0" />
            </div>
          </div>

          <div className="flex shrink-0 justify-end border-t border-border bg-nfc-panel-footer px-4 py-2">
            <SkeletonBone className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
