import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** List page placeholder (/eventos): hero + tarjetas de evento a dos columnas. */
export default function EventsListSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div
      className="min-h-screen animate-pulse bg-surface-app"
      aria-busy="true"
      aria-label="Cargando eventos"
    >
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-48 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-56 lg:px-8">
          <div className="w-full max-w-2xl space-y-4">
            <SkeletonBone tone="on-media" className="h-10 w-72 max-w-full md:h-12" />
            <SkeletonBone tone="on-media" className="h-6 w-full max-w-xl" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2">
          {Array.from({ length: cards }).map((_, i) => (
            <li key={i}>
              <SkeletonCard className="h-full border-l-4 border-l-primary p-8 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <SkeletonBone className="h-6 w-28 rounded-full" />
                    <SkeletonBone className="h-7 w-full" />
                    <SkeletonBone className="h-7 w-3/5" />
                  </div>
                  <SkeletonBone className="h-[76px] w-20 shrink-0 rounded-lg" />
                </div>

                <div className="mb-6 space-y-2">
                  <SkeletonBone className="h-4 w-full bg-surface-muted/80" />
                  <SkeletonBone className="h-4 w-11/12 bg-surface-muted/80" />
                  <SkeletonBone className="h-4 w-4/5 bg-surface-muted/80" />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                  {[0, 1].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <SkeletonBone className="h-10 w-10 shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <SkeletonBone className="h-3 w-12" />
                        <SkeletonBone className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
