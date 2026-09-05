import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton"

export default function HomeLifeSkeleton() {
  return (
    <section
      className="relative animate-pulse overflow-hidden bg-surface-muted py-16 md:py-20"
      aria-busy="true"
      aria-label="Cargando vida en la técnica"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4 text-center md:mb-12">
          <SkeletonBone className="mx-auto h-10 w-72 max-w-full md:h-12" />
          <SkeletonBone className="mx-auto h-1 w-24 bg-accent-gold/40" />
          <SkeletonBone className="mx-auto h-5 w-full max-w-xl bg-surface-muted/80" />
        </header>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <SkeletonCard className="aspect-16/10 w-full p-0" />
          <div className="space-y-3">
            <SkeletonBone className="h-6 w-48" />
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
