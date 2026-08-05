"use client";

import {
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

type ToolbarSelectSize = "sm" | "md";

export type ToolbarSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "className"
> & {
  /** Accessible name; rendered visually as a compact prefix when `showLabel` is true. */
  label: string;
  showLabel?: boolean;
  size?: ToolbarSelectSize;
  leadingIcon?: ReactNode;
  className?: string;
  selectClassName?: string;
  children: ReactNode;
};

const sizeClasses: Record<ToolbarSelectSize, string> = {
  sm: "h-8 text-sm",
  md: "h-9 text-sm",
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const ToolbarSelect = forwardRef<HTMLSelectElement, ToolbarSelectProps>(
  (
    {
      label,
      showLabel = false,
      size = "sm",
      leadingIcon,
      className,
      selectClassName,
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const fieldId =
      id ??
      (props.name ? `toolbar-select-${props.name}` : undefined);

    return (
      <div
        className={[
          "inline-flex min-w-0 items-center gap-1.5",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {showLabel ? (
          <span
            id={fieldId ? `${fieldId}-label` : undefined}
            className="shrink-0 text-xs font-medium text-fg-muted"
          >
            {label}
          </span>
        ) : (
          <label htmlFor={fieldId} className="sr-only">
            {label}
          </label>
        )}

        <div className="relative min-w-[9.5rem] w-fit">
          {leadingIcon ? (
            <span className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-fg-muted [&_svg]:size-3.5">
              {leadingIcon}
            </span>
          ) : null}

          <select
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-label={showLabel ? undefined : label}
            aria-labelledby={
              showLabel && fieldId ? `${fieldId}-label` : undefined
            }
            className={[
              "w-full appearance-none rounded-lg border border-border bg-surface-elevated font-medium text-foreground",
              "transition-colors duration-150",
              "hover:bg-surface-muted",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              leadingIcon ? "pl-8" : "pl-3",
              "pr-8",
              selectClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {children}
          </select>

          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
        </div>
      </div>
    );
  }
);

ToolbarSelect.displayName = "ToolbarSelect";
