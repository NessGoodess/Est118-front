/**
 * Icons for the public header
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

export const HeaderIcons = {
    clock: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
        </Icon>
    ),
    mail: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </Icon>
    ),
    phone: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </Icon>
    ),
    location: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
        </Icon>
    ),
    home: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Icon>
    ),
    news: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M15 18h-5" /><path d="M18 14h-8" /><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="10" y="6" rx="1" />
        </Icon>
    ),
    galery: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" /><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" /><circle cx="13" cy="7" r="1" fill="currentColor" /><rect x="8" y="2" width="14" height="14" rx="2" />
        </Icon>
    ),
    events: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M16 14v2.2l1.6 1" /><path d="M16 2v4" /><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M3 10h5" /><path d="M8 2v4" /><circle cx="16" cy="16" r="6" />
        </Icon>
    ),
    admission: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />
        </Icon>
    ),

} as const;

export type HeaderIconName = keyof typeof HeaderIcons;

interface IconByNameProps {
    name: HeaderIconName;
    className?: string;
}

export function IconByName({ name, className }: IconByNameProps) {
    const IconComponent = HeaderIcons[name];
    if (!IconComponent) return null;

    return <IconComponent className={className} />;
}
