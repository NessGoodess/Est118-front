"use client"

import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Home featured announcements section placeholder. */
export default function AnnouncementsSectionSkeleton() {
  return (
    <section
      id="notices"
      className="relative animate-pulse overflow-hidden bg-surface-app py-16 md:py-20"
      aria-busy="true"
      aria-label="Cargando avisos"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4 text-center md:mb-12">
          <SkeletonBone className="mx-auto h-10 w-72 max-w-full md:h-12" />
          <SkeletonBone className="mx-auto h-1 w-24 bg-accent-gold/40" />
          <SkeletonBone className="mx-auto h-5 w-full max-w-xl bg-surface-muted/80" />
        </header>

        <div className="flex min-h-[min(65vh,640px)] flex-col justify-center">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="space-y-4 lg:pr-2">
              <SkeletonBone className="h-6 w-40 rounded-full" />
              <SkeletonBone className="h-4 w-28" />
              <SkeletonBone className="h-12 w-full max-w-lg" />
              <SkeletonBone className="h-12 w-4/5 max-w-md" />
              <SkeletonBone className="h-1 w-9" />
              <SkeletonBone className="h-4 w-full max-w-md bg-surface-muted/80" />
              <SkeletonBone className="h-4 w-5/6 max-w-sm bg-surface-muted/80" />
              <div className="flex gap-3 pt-2">
                <SkeletonBone className="h-11 w-32" />
                <SkeletonBone className="h-11 w-28 bg-surface-muted/80" />
              </div>
            </div>
            <SkeletonCard className="aspect-[4/3] w-full max-h-[min(56vh,580px)] p-0" />
          </div>
        </div>

        <nav className="mt-8 flex items-center justify-end gap-3" aria-hidden>
          <SkeletonBone className="h-4 w-16" />
          <SkeletonBone className="h-4 w-28" />
          <SkeletonBone className="h-10 w-10 rounded-xl" />
          <SkeletonBone className="h-10 w-10 rounded-xl" />
        </nav>
      </div>
    </section>
  )
}
