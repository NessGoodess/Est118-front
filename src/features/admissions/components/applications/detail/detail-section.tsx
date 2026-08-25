import type { ReactNode } from "react";
import { IconByName, type AppIconName } from "@/components/ui/icons";

export function DetailSection({
  title,
  icon,
  children,
  columns = 2,
}: {
  title: string;
  icon?: AppIconName;
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
        {icon ? (
          <IconByName name={icon} className="h-4 w-4 shrink-0 text-fg-muted" />
        ) : null}
        {title}
      </h3>
      <dl
        className={
          columns === 1
            ? "grid grid-cols-1 gap-3"
            : "grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"
        }
      >
        {children}
      </dl>
    </section>
  );
}

export function DetailField({
  label,
  value,
  mono = false,
  className = "",
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-fg-muted">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm font-medium text-foreground break-words ${
          mono ? "font-mono text-[13px]" : ""
        }`}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
