"use client";

import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarContext";
import { MenuItem } from "./sidebar.types";
import { getIcon } from "./sidebar.icons";
import { SidebarButton } from "./SidebarButton";

interface SidebarGroupProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  activeChildHref?: string;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SidebarGroup({
  item,
  isActive,
  isExpanded,
  isHovered,
  activeChildHref,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: SidebarGroupProps) {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

  const Icon = getIcon(item.icon);
  const ChevronIcon = getIcon("chevron");

  return (
    <div>

      <SidebarButton
        as="button"
        active={isActive}
        collapsed={isCollapsed}
        hovered={isHovered}
        icon={Icon}
        label={item.name}
        badge={item.badge}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          onToggle();
        }}
      >
        <ChevronIcon
          className={`
            w-4 h-4 ml-2
            transition-[opacity,transform] duration-200 ease-in-out
            ${isCollapsed ? "opacity-0" : "opacity-100"}
            ${isExpanded ? "rotate-90" : ""}
          `}
        />
      </SidebarButton>

      <div
        className={`
          overflow-hidden
          transition-[max-height,opacity] duration-300 ease-in-out
          ${!isCollapsed && isExpanded
            ? "max-h-96"
            : "max-h-0 pointer-events-none"}
        `}
      >
        <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
          {item.children?.map((child) => {
            const isChildActive = activeChildHref === child.href;
            const ChildIcon = getIcon(child.icon);

            return (
              <li key={child.name}>
                <Link
                  href={child.href!}
                  onClick={() => isMobile && toggleSidebar()}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium group
                    transition-colors duration-200
                    ${isChildActive
                      ? "bg-sidebar-group-bg text-sidebar-group-text border-l-2 border-sidebar-group-border"
                      : "text-sidebar-group-text-active hover:bg-sidebar-group-bg-h hover:text-sidebar-group-hover"}
                  `}
                >
                  <span
                    className={`
                      transition-colors duration-200
                      ${isChildActive
                        ? "text-sidebar-group-text"
                        : "text-sidebar-group-icon-active group-hover:text-sidebar-group-hover"}
                    `}
                  >
                    <ChildIcon className="w-4 h-4" />
                  </span>

                  <span className={`ml-3 whitespace-nowrap ${isCollapsed ? "pointer-events-none" : ""}`}>
                    {child.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
    </div>
  );
}
