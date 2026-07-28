"use client";

import Link from 'next/link';
import { ReactNode, useRef, useState } from 'react';
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
  as?: 'button' | 'link';
  href?: string;
}

/**
 * Icons stay left-aligned while the aside width clips labels
 * (main panel overlays the text — no centering mid-animation).
 */
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
  as = 'button',
  href,
}: SidebarButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tipPos, setTipPos] = useState<{ top: number; left: number } | null>(null);

  const handleEnter = () => {
    onMouseEnter?.();
    if (collapsed && wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect();
      setTipPos({ top: r.top + r.height / 2, left: r.right + 8 });
    }
  };

  const handleLeave = () => {
    onMouseLeave?.();
    setTipPos(null);
  };

  const baseClasses = `flex w-full items-center justify-start gap-0 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-300 group relative overflow-hidden
    ${
      active
        ? 'bg-brand text-sidebar-button-hover-active shadow-md'
        : 'text-primary hover:bg-sidebar-button-bg-hover hover:text-sidebar-button-text'
    }
  `;

  const content = (
    <>
      <span
        className={`shrink-0 transition-colors duration-300 ${
          active
            ? 'text-sidebar-button-hover-active'
            : 'text-sidebar-button-icon group-hover:text-sidebar-button-text'
        }`}
      >
        <Icon className="w-5 h-5" />
      </span>

      <span className="ml-3 min-w-0 flex-1 truncate whitespace-nowrap text-left">
        {label}
      </span>
      {badge && <SidebarBadge value={badge} />}
      {children}

      {active && <ActiveIndicator />}
    </>
  );

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      {as === 'link' ? (
        <Link
          href={href!}
          onClick={onClick}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className={baseClasses}
          title={collapsed ? label : undefined}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className={baseClasses}
          title={collapsed ? label : undefined}
        >
          {content}
        </button>
      )}

      {collapsed && hovered && tipPos && (
        <SidebarTooltip label={label} top={tipPos.top} left={tipPos.left} />
      )}
    </div>
  );
}
