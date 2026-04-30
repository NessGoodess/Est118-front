
/**
 * Icons for the global
 */
interface IconProps {
    className?: string;
}

const Icon = ({ children, className = "w-5 h-5" }: { children: React.ReactNode, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

export const GlobalIcons = {
    leftArrow: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m15 18-6-6 6-6" />
        </Icon>
    ),
    rightArrow: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m9 18 6-6-6-6" />
        </Icon>
    ),
    Check: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M18 6 7 17l-5-5" />
            <path d="m22 10-7.5 7.5L13 16" />
        </Icon>
    ),
    rightArrowLink: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </Icon>
    ),
    leftArrowLink: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </Icon>
    ),



} as const;

export type GlobalIconName = keyof typeof GlobalIcons;

interface IconByNameProps {
    name: GlobalIconName;
    className?: string;
}

export function IconByName({ name, className }: IconByNameProps) {
    const IconComponent = GlobalIcons[name];
    if (!IconComponent) return null;

    return <IconComponent className={className} />;
}
