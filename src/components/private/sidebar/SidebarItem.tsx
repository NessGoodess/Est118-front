"use client";

import { useSidebar } from '@/contexts/SidebarContext';
import { MenuItem } from './sidebar.types';
import { getIcon } from './sidebar.icons';
import { SidebarButton } from './SidebarButton';

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SidebarItem({ 
  item, 
  isActive, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarItemProps) {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const Icon = getIcon(item.icon);

  return (
    <SidebarButton
      as="link"
      href={item.href}
      active={isActive}
      collapsed={isCollapsed}
      hovered={isHovered}
      icon={Icon}
      label={item.name}
      badge={item.badge}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => isMobile && toggleSidebar()}
    />
  );
}

