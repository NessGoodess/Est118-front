import Icon, { IconName } from "./Icon";

export default function GenericHeader(
    {
        title,
        description,
        icon
    }: {
        title: string,
        description: string,
        icon: string
    }
) {

    return (
        <header className="mb-6">
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white bg-primary">
                    <Icon name={icon as IconName} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-level-2">{title}</h1>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </header>
    );
}