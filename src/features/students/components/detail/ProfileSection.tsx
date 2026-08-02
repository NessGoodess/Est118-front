import type { ElementType, ReactNode } from "react";

/** Self-contained profile block (article by default; photo may use section). */
export default function ProfileSection({
  title,
  description,
  children,
  className = "",
  actions,
  elevated = false,
  as: Tag = "article",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  elevated?: boolean;
  as?: Extract<ElementType, "article" | "section">;
}) {
  return (
    <Tag
      className={[
        "min-w-0 max-w-full rounded-2xl border bg-surface-elevated overflow-hidden",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        elevated
          ? "relative z-10 -translate-y-2 border-primary/35 shadow-[0_12px_40px_rgba(0,13,68,0.18),0_4px_12px_rgba(0,13,68,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-primary/20"
          : "border-border/80 shadow-sm",
        className,
      ].join(" ")}
    >
      <header className="border-b border-border bg-surface-muted/70 px-5 py-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
          {description ? <p className="text-sm text-fg-muted mt-1">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div> : null}
      </header>
      <div className="p-3 lg:p-5 sm:p-6 min-w-0">{children}</div>
    </Tag>
  );
}
