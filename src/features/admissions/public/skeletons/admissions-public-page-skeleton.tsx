import { SkeletonBone, SkeletonCard } from "@/components/ui/skeleton/SectionSkeleton";

/** Skeleton de /inscripciones: hero + estado del periodo + requisitos. */
export default function AdmissionsPublicPageSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse bg-surface-app"
      aria-busy="true"
      aria-label="Cargando preinscripciones"
    >
      <header
        className="public-hero-offset relative overflow-hidden bg-linear-to-br from-brand-900 via-brand-700 to-brand-500"
      >
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-4 md:gap-6">
            <SkeletonBone className="h-14 w-44 bg-white/20" />
            <div className="hidden h-px flex-1 bg-white/10 sm:block" aria-hidden />
            <SkeletonBone className="h-3 w-32 bg-white/15" />
          </div>
          <SkeletonBone className="mb-5 h-3 w-56 bg-white/15" />
          <div className="max-w-3xl space-y-4">
            <SkeletonBone className="h-10 w-full max-w-xl bg-white/25" />
            <SkeletonBone className="h-10 w-4/5 max-w-md bg-white/20" />
            <SkeletonBone className="h-4 w-full max-w-2xl bg-white/15" />
            <SkeletonBone className="h-4 w-5/6 max-w-xl bg-white/15" />
            <SkeletonBone className="h-3 w-64 bg-white/10" />
          </div>
        </div>
      </header>

      <section className="bg-surface-app px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="max-w-2xl space-y-4">
            <SkeletonBone className="h-3 w-40" />
            <SkeletonBone className="h-9 w-full max-w-lg" />
            <SkeletonBone className="h-9 w-4/5 max-w-md" />
            <SkeletonBone className="h-4 w-full max-w-prose bg-surface-muted/80" />
            <SkeletonBone className="h-4 w-full max-w-md bg-surface-muted/80" />
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <SkeletonBone className="h-30 w-30 shrink-0 rounded-full" />
              <div className="space-y-2">
                <SkeletonBone className="h-3 w-28 bg-surface-muted/80" />
                <SkeletonBone className="h-7 w-48" />
              </div>
            </div>
          </div>

          <SkeletonCard className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
              <SkeletonBone className="h-3 w-36" />
              <SkeletonBone className="h-3 w-40" />
            </div>
            <SkeletonBone className="h-4 w-full bg-surface-muted/80" />
            <SkeletonBone className="h-4 w-5/6 max-w-lg bg-surface-muted/80" />
          </SkeletonCard>
        </div>
      </section>

      <section className="border-t border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBone className="h-8 w-64 max-w-full" />
              <SkeletonBone className="h-4 w-full max-w-md bg-surface-muted/80" />
            </div>
            <SkeletonBone className="h-3 w-36" />
          </div>
          <div className="grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="space-y-3 border-b border-r border-border bg-surface-elevated p-5 sm:p-6"
              >
                <SkeletonBone className="h-3 w-8" />
                <SkeletonBone className="h-5 w-4/5" />
                <SkeletonBone className="h-4 w-full bg-surface-muted/80" />
                <SkeletonBone className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
