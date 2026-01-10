"use client";

import Link from 'next/link';
import { ReactNode } from 'react';
import { SidebarTooltip, SidebarBadge, ActiveIndicator } from './SidebarButton.components';

interface SidebarButtonProps {
    active?: boolean;
    collapsed?: boolean;
    hovered?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: string | number;
    children?: ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    as?: "button" | "link";
    href?: string;
}

export function SidebarButton({
    active = false,
    collapsed = false,
    hovered = false,
    icon: Icon,
    label,
    badge,
    children,
    onMouseEnter,
    onMouseLeave,
    onClick,
    as = "button",
    href,
}: SidebarButtonProps) {
    const baseClasses = `flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-400 group relative
    ${active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-sidebar-button-hover-active shadow-lg'
            : 'text-primary hover:bg-sidebar-button-bg-hover hover:text-sidebar-button-text hover:shadow-lg'
        }
    ${collapsed ? 'justify-start px-0' : ' justify-start'}
  `;

    const content = (
        <>
            {collapsed && hovered && <SidebarTooltip label={label} />}

            <span className={`transition-colors duration-400 ${active ? 'text-sidebar-button-hover-active' : 'text-sidebar-button-icon group-hover:text-sidebar-button-text'}`}>
                <Icon className="w-5 h-5" />
            </span>

            <>
                <span className={`ml-3 whitespace-nowrap transition-all duration-400 ease-in-out 
                    ${collapsed ? 'opacity-o translate-x-2 pointer-events-none' : 'opcacity-100 translate-x-0'}`}>{label}</span>
                {badge && <SidebarBadge value={badge} />}
                {children}
            </>

            {active && <ActiveIndicator />}
        </>
    );

    if (as === "link") {
        return (
            <Link
                href={href!}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={baseClasses}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={baseClasses}
        >
            {content}
        </button>
    );
}

