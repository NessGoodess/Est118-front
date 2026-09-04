import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

/** Detail page placeholder (/Announcements/[id]). */
export default function AnnouncementDetailSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse"
      aria-busy="true"
      aria-label="Cargando aviso"
    >
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-36 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-44 lg:px-8">
          <div className="w-full max-w-3xl space-y-3">
            <SkeletonBone tone="on-media" className="h-3 w-28" />
            <SkeletonBone tone="on-media" className="h-9 w-full max-w-2xl" />
            <div className="flex gap-2">
              <SkeletonBone tone="on-media" className="h-6 w-24 rounded-full" />
              <SkeletonBone tone="on-media" className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBone tone="on-media" className="h-4 w-48" />
          </div>
        </div>
      </header>

      <article className="px-[clamp(20px,5vw,64px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,8vw,96px)]">
        <div className="mx-auto max-w-6xl space-y-10">
          <SkeletonCard className="p-4 md:p-6 lg:p-8">
            <SkeletonBone className="aspect-[16/10] w-full max-h-[min(56vh,620px)] rounded-2xl" />
          </SkeletonCard>

          <div className="mx-auto max-w-3xl space-y-6">
            <SkeletonBone className="h-5 w-full border-l-4 border-transparent pl-5" />
            <SkeletonBone className="h-5 w-11/12" />
            <SkeletonBone className="h-4 w-full" />
            <SkeletonBone className="h-4 w-4/5" />
            <SkeletonBone className="mt-4 aspect-video w-full rounded-2xl" />
          </div>
        </div>
      </article>
    </div>
  )
}
