"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { IconByName } from "@/components/ui/icons";

export function HeaderToggle() {
  const { toggleSidebar, isCollapsed, isMobile } = useSidebar();
  const iconName = isMobile
    ? "menu"
    : isCollapsed
      ? "sidebarOpen"
      : "sidebarClose";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="rounded-lg p-2 text-fg-muted transition-all duration-200 hover:bg-surface-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:text-foreground"
      title={isCollapsed ? "Expandir menú" : "Contraer menú"}
      aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
    >
      <IconByName name={iconName} className="h-5 w-5 active:text-primary" />
    </button>
  );
}
