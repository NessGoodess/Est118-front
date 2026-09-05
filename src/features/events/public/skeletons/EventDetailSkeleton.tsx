import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Detail page placeholder (/eventos/[id]): hero md + portada + datos + cuerpo. */
export default function EventDetailSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse bg-surface-app"
      aria-busy="true"
      aria-label="Cargando evento"
    >
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-36 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-44 lg:px-8">
          <div className="w-full max-w-3xl space-y-3">
            <SkeletonBone tone="on-media" className="h-3 w-24" />
            <SkeletonBone tone="on-media" className="h-9 w-full max-w-2xl" />
            <SkeletonBone tone="on-media" className="h-4 w-56" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <SkeletonCard className="overflow-hidden p-0 shadow-xl">
          <SkeletonBone className="h-96 w-full rounded-none md:h-[500px]" />

          <div className="p-8 md:p-12">
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 rounded-lg bg-primary-soft p-4">
                  <SkeletonBone className="h-3 w-12" />
                  <SkeletonBone className="h-5 w-28" />
                </div>
              ))}
            </div>

            <div className="mb-6 space-y-3">
              <SkeletonBone className="h-5 w-full" />
              <SkeletonBone className="h-5 w-10/12" />
            </div>

            <div className="space-y-2">
              <SkeletonBone className="h-4 w-full bg-surface-muted/80" />
              <SkeletonBone className="h-4 w-11/12 bg-surface-muted/80" />
              <SkeletonBone className="h-4 w-full bg-surface-muted/80" />
              <SkeletonBone className="h-4 w-3/5 bg-surface-muted/80" />
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <SkeletonBone className="h-4 w-40" />
            </div>
          </div>
        </SkeletonCard>
      </section>
    </div>
  )
}
