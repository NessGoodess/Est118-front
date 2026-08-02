interface GenericHeaderSkeletonProps {
  className?: string;
  /** Show a slot on the right (e.g. back button area) */
  showChildren?: boolean;
  /** Show a bottom strip (e.g. grade cards) */
  showBottom?: boolean;
}

/** Matches GenericHeader layout for route `loading.tsx` and page skeletons. */
export default function GenericHeaderSkeleton({
  className = "",
  showChildren = true,
  showBottom = false,
}: GenericHeaderSkeletonProps) {
  return (
    <header
      className={`mb-2 2xl:mb-4 animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Cargando encabezado"
    >
      <div className="mb-1 flex flex-col gap-3 2xl:mb-3 md:flex-row md:items-center md:gap-4">
        <div className="min-w-0 md:max-w-[36%] md:shrink-0 lg:max-w-[40%] space-y-2">
          <div className="h-7 w-56 max-w-full rounded-md bg-surface-muted md:h-8" />
          <div className="h-3 w-72 max-w-full rounded bg-surface-muted/80" />
        </div>
        {showChildren ? (
          <div className="flex min-w-0 w-full flex-1 items-center gap-2 md:w-auto md:justify-end">
            <div className="h-9 w-40 rounded-lg border border-border bg-surface-elevated" />
          </div>
        ) : null}
      </div>
      {showBottom ? (
        <div className="mt-2 h-16 max-w-2xl w-full rounded-lg border border-border bg-surface-elevated" />
      ) : null}
    </header>
  );
}
