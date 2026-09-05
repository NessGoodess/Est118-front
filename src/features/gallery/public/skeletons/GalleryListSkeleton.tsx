import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Album grid placeholder (/galeria). */
export default function GalleryListSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="min-h-screen animate-pulse" aria-busy="true" aria-label="Cargando galería">
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-48 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-56 lg:px-8">
          <div className="w-full max-w-2xl space-y-4">
            <SkeletonBone tone="on-media" className="h-10 w-56 max-w-full md:h-12" />
            <SkeletonBone tone="on-media" className="h-6 w-full max-w-lg" />
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface-elevated/95">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBone key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <li key={i}>
              <SkeletonCard className="flex h-full flex-col overflow-hidden p-0">
                <SkeletonBone className="aspect-[4/3] w-full rounded-none rounded-t-xl" />
                <div className="space-y-3 p-5">
                  <SkeletonBone className="h-5 w-4/5" />
                  <SkeletonBone className="h-3 w-full bg-surface-muted/80" />
                  <SkeletonBone className="h-3 w-2/3 bg-surface-muted/80" />
                  <div className="flex justify-between border-t border-border pt-3">
                    <SkeletonBone className="h-3 w-28" />
                    <SkeletonBone className="h-3 w-16" />
                  </div>
                </div>
              </SkeletonCard>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
