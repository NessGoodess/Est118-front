import Icon, { IconName } from "./Icon";

interface GenericHeaderProps {
    title: string;
    description: string;
    icon?: IconName;
}

export default function GenericHeader(
    {
        title,
        description,
        icon
    }: GenericHeaderProps
) {

    return (
        <header className="mb-2 2xl:mb-4">
            <div className="flex items-center gap-4 mb-1 2xl:mb-3">
                {icon && (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-fg-muted">
                        <Icon name={icon} />
                    </div>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-brand-strong">{title}</h1>
                    <p className="text-xs md:text-sm text-fg-muted">{description}</p>
                </div>
            </div>
        </header>
    );
}
