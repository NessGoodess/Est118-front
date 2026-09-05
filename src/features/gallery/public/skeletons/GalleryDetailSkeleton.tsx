import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton"

/** Album detail placeholder (/galeria/[slug]). */
export default function GalleryDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" aria-busy="true" aria-label="Cargando álbum">
      <header className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900">
        <div className="relative z-10 mx-auto flex min-h-36 max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-44 lg:px-8">
          <div className="w-full max-w-2xl space-y-3">
            <SkeletonBone tone="on-media" className="h-4 w-24" />
            <SkeletonBone tone="on-media" className="h-9 w-72 max-w-full" />
            <SkeletonBone tone="on-media" className="h-5 w-40 rounded-full" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-2">
          <SkeletonBone className="h-4 w-full" />
          <SkeletonBone className="h-4 w-5/6" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SkeletonBone className="col-span-2 aspect-[16/10] w-full rounded-xl sm:row-span-2 sm:aspect-auto" />
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBone key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  )
}
