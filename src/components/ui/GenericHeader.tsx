import type { ReactNode } from "react";

interface GenericHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  subtitle?: ReactNode;
  bottomContent?: ReactNode;
  isLoading?: boolean;
  isChildrenLoading?: boolean;
  isBottomContentLoading?: boolean;
  loadingComponent?: ReactNode;
  bottomContentLoadingComponent?: ReactNode;
  childrenLoadingComponent?: ReactNode;
}

export default function GenericHeader({
  title,
  description,
  icon,
  className = "",
  children,
  subtitle,
  bottomContent,
  isLoading,
  isChildrenLoading,
  isBottomContentLoading,
  loadingComponent,
  bottomContentLoadingComponent,
  childrenLoadingComponent,
}: GenericHeaderProps) {
  const bottomLoading = isBottomContentLoading ?? isLoading;
  const childrenLoading = isChildrenLoading ?? isLoading;

  const childrenFallback =
    childrenLoadingComponent ?? loadingComponent ?? <DefaultChildrenComponent />;
  const bottomFallback =
    bottomContentLoadingComponent ?? loadingComponent ?? <DefaultBottomContentComponent />;

  return (
    <header className={`${className}`}>
      <div className="mb-1 flex flex-wrap justify-between gap-3 2xl:mb-3 md:items-center md:gap-4">
        {icon != null && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-fg-muted md:h-12 md:w-12">
            {icon}
          </div>
        )}
        <div className="min-w-0 md:shrink-0 lg:max-w-[40%]">
          <h1 className="text-xl font-bold text-brand-strong md:text-2xl">{title}</h1>
          {subtitle || <p className="text-xs text-fg-muted md:text-sm">{description}</p>}
        </div>
        {children != null && (
          <div className="flex min-w-0 w-fit flex-wrap items-center justify-end gap-2 md:w-auto">
            {childrenLoading ? childrenFallback : children}
          </div>
        )}
      </div>
      {bottomContent != null && (
        <div className="mt-2">{bottomLoading ? bottomFallback : bottomContent}</div>
      )}
    </header>
  );
}

function DefaultChildrenComponent() {
  return (
    <div
      className="flex h-16 w-full max-w-2xl animate-pulse items-center gap-2 rounded-lg border border-border bg-surface-elevated p-2"
      aria-busy="true"
      aria-label="Cargando"
    />
  );
}

function DefaultBottomContentComponent() {
  return (
    <div
      className="flex h-6 w-full max-w-xl animate-pulse items-center gap-2 rounded-lg bg-surface-elevated p-2"
      aria-busy="true"
      aria-label="Cargando"
    />
  );
}
