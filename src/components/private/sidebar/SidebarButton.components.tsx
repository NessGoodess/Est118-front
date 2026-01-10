"use client";

interface SidebarTooltipProps {
  label: string;
}

export function SidebarTooltip({ label }: SidebarTooltipProps) {
  return (
    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl z-[100] whitespace-nowrap border border-slate-600 pointer-events-none">
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
    <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
      {value}
    </span>
  );
}

export function ActiveIndicator() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
  );
}

