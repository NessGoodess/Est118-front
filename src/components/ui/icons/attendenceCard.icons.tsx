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

export const AttendenceCardIcons = {
    student: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </Icon>
    ),
    card: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M16 10h2" /><path d="M16 14h2" />
            <path d="M6.17 15a3 3 0 0 1 5.66 0" />
            <circle cx="9" cy="11" r="2" />
            <rect x="2" y="5" width="20" height="14" rx="2" />
        </Icon>
    ),
    grade: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M12 21V7" />
            <path d="m16 12 2 2 4-4" />
            <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
        </Icon>
    ),
    group: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <circle cx="9" cy="7" r="4" />
        </Icon>
    ),
    waiting: ({ className = "w-5 h-5 animate-spin" }: IconProps) => (
        <Icon className={className}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </Icon>
    ),
    fullscreen: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m15 15 6 6" />
            <path d="m15 9 6-6" />
            <path d="M21 16v5h-5" />
            <path d="M21 8V3h-5" />
            <path d="M3 16v5h5" />
            <path d="m3 21 6-6" />
            <path d="M3 8V3h5" />
            <path d="M9 9 3 3" />
        </Icon>
    ),
    exit: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" />
            <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
            <path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
            <path d="M9 4.2V9m0 0H4.2M9 9 3 3" />
        </Icon>
    ),
    success: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M18 6 7 17l-5-5" />
            <path d="m22 10-7.5 7.5L13 16" />
        </Icon>
    ),
    error: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </Icon>
    ),
    scanning: ({ className = "w-5 h-5 animate-spin" }: IconProps) => (
        <Icon className={className}>
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <circle cx="12" cy="12" r="3" />
            <path d="m16 16-1.9-1.9" />
        </Icon>
    ),
    info: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </Icon>
    ),
    warning: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </Icon>
    ),
    history: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </Icon>
    ),
    timer: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Icon>
    ),
    readerOff: ({ className = "w-5 h-5" }: IconProps) => (
        <Icon className={className}>
            <path d="m19 5 3-3" /><path d="m2 22 3-3" />
            <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
            <path d="M7.5 13.5 10 11" /><path d="M10.5 16.5 13 14" />
            <path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />
        </Icon>
    ),

} as const;

export type AttendenceCardIconName = keyof typeof AttendenceCardIcons;

interface IconByNameProps {
    name: AttendenceCardIconName;
    className?: string;
}

export function IconByName({ name, className }: IconByNameProps) {
    const IconComponent = AttendenceCardIcons[name];
    if (!IconComponent) return null;

    return <IconComponent className={className} />;
}
