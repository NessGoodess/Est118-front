/** Skeleton while student expediente is loading. */
export default function StudentDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Cargando expediente">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/80 bg-surface-elevated overflow-hidden shadow-sm"
        >
          <div className="border-b border-border bg-surface-muted/70 px-5 py-4 flex justify-between gap-3">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="h-4 w-40 max-w-full rounded bg-surface-muted" />
              <div className="h-3 w-64 max-w-full rounded bg-surface-muted/80" />
            </div>
            <div className="h-8 w-20 shrink-0 rounded-lg bg-surface-muted" />
          </div>
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: i === 0 ? 6 : 3 }).map((_, j) => (
              <div key={j} className="rounded-xl border border-border/60 p-3 space-y-2">
                <div className="h-2.5 w-16 rounded bg-surface-muted" />
                <div className="h-4 w-28 max-w-full rounded bg-surface-muted/80" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudentPhotoSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border/80 bg-surface-elevated overflow-hidden shadow-sm animate-pulse"
      aria-hidden
    >
      <div className="border-b border-border bg-surface-muted/70 px-5 py-4">
        <div className="h-4 w-24 rounded bg-surface-muted" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="aspect-square w-full rounded-xl bg-surface-muted" />
      </div>
    </div>
  );
}
