import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** List page grid placeholder (/Announcements). */
export default function AnnouncementsListSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      className="min-h-screen animate-pulse"
      aria-busy="true"
      aria-label="Cargando avisos y noticias"
    >
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-48 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-56 lg:px-8">
          <div className="w-full max-w-2xl space-y-4">
            <SkeletonBone tone="on-media" className="h-10 w-64 max-w-full md:h-12" />
            <SkeletonBone tone="on-media" className="h-6 w-full max-w-xl" />
          </div>
        </div>
      </header>

      <section className="px-[clamp(16px,5vw,72px)] pt-[clamp(24px,4vw,40px)] pb-[clamp(48px,8vw,96px)]">
        <ul className="mx-auto grid max-w-7xl list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <li key={i}>
              <SkeletonCard className="flex h-full flex-col overflow-hidden p-0">
                <SkeletonBone className="aspect-[4/3] w-full rounded-none rounded-t-xl" />
                <div className="space-y-3 p-5">
                  <div className="flex gap-2">
                    <SkeletonBone className="h-5 w-20 rounded-full" />
                    <SkeletonBone className="h-5 w-16 rounded-full" />
                  </div>
                  <SkeletonBone className="h-3 w-24" />
                  <SkeletonBone className="h-5 w-full" />
                  <SkeletonBone className="h-5 w-4/5" />
                  <SkeletonBone className="h-0.5 w-8" />
                  <SkeletonBone className="h-3 w-full bg-surface-muted/80" />
                  <SkeletonBone className="h-3 w-5/6 bg-surface-muted/80" />
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
