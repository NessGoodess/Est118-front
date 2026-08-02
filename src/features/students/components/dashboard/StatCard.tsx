import Link from "next/link";

export default function StatCard({
  label,
  value,
  hint,
  loading,
  icon,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  icon: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary">
          {icon}
        </div>
        {loading ? (
          <div className="h-7 w-14 animate-pulse rounded-md bg-surface-muted" />
        ) : (
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground leading-none">
            {value}
          </p>
        )}
      </div>
      <div className="mt-3 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-fg-muted">{hint}</p> : null}
      </div>
    </>
  );

  const className = `block h-full rounded-xl border border-border bg-surface-elevated p-4 shadow-sm transition-[border-color,transform,box-shadow] ${
    href
      ? "hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      : ""
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
