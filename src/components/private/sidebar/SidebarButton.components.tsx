"use client";

interface SidebarTooltipProps {
  label: string;
  top: number;
  left: number;
}

/** Fixed tooltip so it escapes aside overflow clipping when collapsed. */
export function SidebarTooltip({ label, top, left }: SidebarTooltipProps) {
  return (
    <div
      className="fixed z-[200] px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap border border-slate-600 pointer-events-none -translate-y-1/2"
      style={{ top, left }}
      role="tooltip"
    >
      {label}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600" />
    </div>
  );
}

interface SidebarBadgeProps {
  value: string | number;
}

export function SidebarBadge({ value }: SidebarBadgeProps) {
  return (
    <span className="ml-auto shrink-0 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
      {value}
    </span>
  );
}

export function ActiveIndicator() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
  );
}
