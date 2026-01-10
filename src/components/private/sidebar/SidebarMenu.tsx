"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from './sidebar.config';
import { MenuItem } from './sidebar.types';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup } from './SidebarGroup';
import { useSidebar } from '@/contexts/SidebarContext';

export function SidebarMenu() {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => child.href === pathname);
    }
    return false;
  };

  const getActiveChildHref = (item: MenuItem): string | undefined => {
    if (!item.children) return undefined;
    return item.children.find(child => child.href === pathname)?.href;
  };

  return (
    <nav className={`flex-1 py-4 overflow-x-visible overflow-y-auto transition-all duration-400 ease-in-out ${isCollapsed ? 'px-2' : 'px-4'}`}>
      <ul className="space-y-1 overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = isItemActive(item);
          const isHovered = hoveredItem === item.name;
          const isExpanded = expandedItems.has(item.name);
          const hasChildren = item.children && item.children.length > 0;
          const activeChildHref = hasChildren ? getActiveChildHref(item) : undefined;

          return (
            <li key={item.name} className="relative overflow-visible">
              {hasChildren ? (
                <SidebarGroup
                  item={item}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  isHovered={isHovered}
                  activeChildHref={activeChildHref}
                  onToggle={() => toggleExpanded(item.name)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ) : (
                <SidebarItem
                  item={item}
                  isActive={isActive}
                  isHovered={isHovered}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

