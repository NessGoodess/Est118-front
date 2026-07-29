
export default function Loading() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 items-start">
      {/* Main Card Skeleton */}
      <article className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-border bg-surface-elevated">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:items-center lg:justify-between gap-1 mb-2">
          {/* Title Section Skeleton */}
          <div className="flex flex-col items-start gap-4 w-full 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-4 bg-surface-muted p-4 md:p-8">
            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
              <div className="w-[clamp(40px,6vw,100px)] h-[clamp(40px,6vw,100px)] bg-surface-muted rounded-2xl animate-pulse" />
              <div className="h-8 bg-surface-muted rounded-lg w-64 animate-pulse" />
            </div>
            <div className="flex items-center justify-between w-full gap-4 flex-1 min-w-[200px]">
              <div className="h-6 bg-surface-muted rounded-lg w-32 animate-pulse" />
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-surface-elevated/80">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-muted animate-pulse" />
                <div className="h-4 bg-surface-muted rounded w-20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Status Badge Skeleton */}
          <div className="hidden md:flex w-full justify-end px-4 md:px-6 mt-2">
            <div className="inline-flex items-center gap-3 py-3 px-6 rounded-xl bg-surface-muted border-2 border-border">
              <div className="w-6 h-6 bg-surface-muted rounded-full animate-pulse" />
              <div className="h-4 bg-surface-muted rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-[minmax(220px,320px)_1fr] max-[900px]:grid-cols-1 gap-[clamp(1rem,3vw,3rem)] items-start p-[clamp(1rem,2vw,2rem)]">
          {/* Photo Section Skeleton */}
          <div className="space-y-[clamp(0.5rem,1.5vw,1.5rem)]">
            <div className="relative group">
              <div className="aspect-square md:aspect-3/4 overflow-hidden rounded-2xl shadow-2xl bg-surface-muted animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-surface-muted to-border" />
              </div>
            </div>
          </div>

          {/* Info Section Skeleton */}
          <div className="space-y-[clamp(0.5rem,1.5vw,1.5rem)]">
            {/* Main info card skeleton */}
            <div className="bg-surface-elevated/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-border space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-surface-muted rounded-full animate-pulse" />
                  <div className="h-4 bg-surface-muted rounded w-24 animate-pulse" />
                </div>
                <div className="bg-surface-muted rounded-xl p-4 border border-border">
                  <div className="h-6 bg-surface-muted rounded w-48 animate-pulse" />
                </div>
              </div>

              {/* Grade and Group fields */}
              <div className="grid grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-surface-muted rounded-full animate-pulse" />
                      <div className="h-4 bg-surface-muted rounded w-16 animate-pulse" />
                    </div>
                    <div className="bg-surface-muted rounded-xl p-4 border border-border">
                      <div className="h-6 bg-surface-muted rounded w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Credential ID field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-surface-muted rounded-full animate-pulse" />
                  <div className="h-4 bg-surface-muted rounded w-28 animate-pulse" />
                </div>
                <div className="bg-surface-muted rounded-xl p-4 border border-border">
                  <div className="h-6 bg-surface-muted rounded w-36 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* History Section Skeleton */}
      <article className="bg-surface-elevated rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="bg-surface-muted border-b border-border px-6 sm:px-8 py-6 w-full">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="h-6 bg-surface-muted rounded w-48 animate-pulse" />
            <div className="h-6 w-6 bg-surface-muted rounded-full animate-pulse" />
          </div>
          <div className="h-4 bg-surface-muted rounded w-64 mt-2 animate-pulse" />
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          {/* History list items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
              <div className="w-10 h-10 bg-surface-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-surface-muted rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-16 h-6 bg-surface-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}