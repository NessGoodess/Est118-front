import { ReactNode } from "react";

type SurfaceVariant = "elevated" | "muted" | "transparent";

type SectionWrapperProps = {
  left: ReactNode;
  right: ReactNode;
  bottom?: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  leftVariant?: SurfaceVariant;
  rightVariant?: SurfaceVariant;
  leftClassName?: string;
  rightClassName?: string;
};

const SURFACE: Record<SurfaceVariant, string> = {
  elevated: "bg-surface-elevated",
  muted: "bg-surface-muted",
  transparent: "bg-transparent shadow-none",
};

function joinClasses(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function SectionWrapper({
  left,
  right,
  bottom,
  leftTitle,
  rightTitle,
  leftVariant = "elevated",
  rightVariant = "elevated",
  leftClassName,
  rightClassName,
}: SectionWrapperProps) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-6">
        <fieldset
          className={joinClasses(
            "min-w-0 rounded-lg border border-border p-3 shadow-card sm:p-4 xl:col-span-4 xl:p-6",
            SURFACE[leftVariant],
            leftClassName
          )}
        >
          {leftTitle ? (
            <legend className="mb-2 text-sm font-semibold text-foreground">
              {leftTitle}
            </legend>
          ) : null}
          {left}
        </fieldset>

        <fieldset
          className={joinClasses(
            "min-w-0 overflow-hidden rounded-lg border border-border p-3 shadow-card sm:p-4 xl:col-span-8 xl:p-6",
            SURFACE[rightVariant],
            rightClassName
          )}
        >
          {rightTitle ? (
            <legend className="mb-2 text-sm font-semibold text-foreground">
              {rightTitle}
            </legend>
          ) : null}
          <div className="min-w-0">{right}</div>
        </fieldset>
      </div>
      {bottom != null ? <footer className="w-auto">{bottom}</footer> : null}
    </>
  );
}
