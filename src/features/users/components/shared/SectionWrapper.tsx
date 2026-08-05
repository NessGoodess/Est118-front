import { ReactNode } from "react";

type SectionWrapperProps = {
  left: ReactNode;
  right: ReactNode;
  bottom: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
};

export function SectionWrapper({
  left,
  right,
  bottom,
  leftTitle,
  rightTitle,
}: SectionWrapperProps) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-6 lg:gap-4 2xl:grid-cols-12 2xl:gap-6">
        <fieldset className="col-span-2 min-w-0 rounded-lg border border-border bg-surface-elevated p-2 shadow-card 2xl:col-span-4 2xl:p-6">
          {leftTitle && <legend className="mb-2  text-sm text-foreground">
            {leftTitle}
          </legend>}
          {left}
        </fieldset>

        <fieldset className="col-span-4 min-w-0 overflow-hidden rounded-lg border border-border bg-surface-elevated p-2 shadow-card 2xl:col-span-8 2xl:p-6">
          {rightTitle && <legend className="mb-2 text-sm font-semibold text-foreground">
            {rightTitle}
          </legend>}
          {right}
        </fieldset>
      </div>
      <footer className="w-auto ">
        {bottom}
      </footer>
    </>
  );
}