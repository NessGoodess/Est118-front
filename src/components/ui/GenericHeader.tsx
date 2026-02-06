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
        <header className="mb-4 md:mb-6">
            <div className="flex items-center gap-4 mb-3">
                {icon && (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-slate-400">
                        <Icon name={icon} />
                    </div>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-level-2">{title}</h1>
                    <p className="text-xs md:text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </header>
    );
}