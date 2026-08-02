type SkeletonAs = "article" | "section" | "div";

export function SkeletonBone({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-surface-muted ${className}`} aria-hidden />;
}

export function SkeletonCard({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface-elevated p-4 shadow-sm ${className}`}
      aria-hidden
    >
      {children}
    </div>
  );
}

/**
 * Generic article/section loading shell — header + body slot.
 * Compose with SkeletonCard / SkeletonBone for feature-specific layouts.
 */
export default function SectionSkeleton({
  as: Tag = "article",
  className = "",
  showHeader = true,
  label = "Cargando sección",
  children,
}: {
  as?: SkeletonAs;
  className?: string;
  showHeader?: boolean;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <Tag
      className={`animate-pulse space-y-4 ${className}`}
      aria-busy="true"
      aria-label={label}
    >
      {showHeader ? (
        <header className="space-y-2">
          <SkeletonBone className="h-5 w-36 max-w-full" />
          <SkeletonBone className="h-3 w-56 max-w-full bg-surface-muted/80" />
        </header>
      ) : null}
      {children}
    </Tag>
  );
}
