import Icon, { IconName } from "./Icon";

interface GenericHeaderProps {
    title: string;
    description: string;
    icon?: IconName;
    className?: string;
    children?: React.ReactNode;
    subtitle?: React.ReactNode;
    bottomContent?: React.ReactNode;
    isLoading?: boolean;
    isChildrenLoading?: boolean;
    isBottomContentLoading?: boolean;
    loadingComponent?: React.ReactNode;
    bottomContentLoadingComponent?: React.ReactNode;
    childrenLoadingComponent?: React.ReactNode;
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
        <header className={`mb-2 2xl:mb-4 ${className}`}>
            <div className="mb-1 flex flex-col gap-3 2xl:mb-3 md:flex-row md:items-center md:gap-4">
                {icon && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-fg-muted md:h-12 md:w-12">
                        <Icon name={icon} />
                    </div>
                )}
                <div className="min-w-0 md:max-w-[36%] md:shrink-0 lg:max-w-[40%]">
                    <h1 className="text-xl font-bold text-brand-strong md:text-2xl">{title}</h1>
                    {subtitle || <p className="text-xs text-fg-muted md:text-sm">{description}</p>}
                </div>
                {children != null && (
                    <div className="flex min-w-0 w-full flex-1 items-center gap-2 md:w-auto md:justify-end">
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
        <div className="flex items-center gap-2 bg-surface-elevated border border-border rounded-lg h-16 max-w-2xl w-full p-2 animate-pulse"
            aria-busy="true"
            aria-label="Cargando">
        </div>
    );
}

function DefaultBottomContentComponent() {
    return (
        <div className="flex items-center gap-2 bg-surface-elevated rounded-lg h-6 max-w-xl w-full p-2 animate-pulse"
            aria-busy="true"
            aria-label="Cargando">
        </div>
    );
}
