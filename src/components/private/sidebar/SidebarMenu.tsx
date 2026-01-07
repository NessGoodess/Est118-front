"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from './sidebar.config';
import { MenuItem } from './sidebar.types';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup } from './SidebarGroup';

export function SidebarMenu() {
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
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const isActive = isItemActive(item);
          const isHovered = hoveredItem === item.name;
          const isExpanded = expandedItems.has(item.name);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <li key={item.name} className="relative">
              {hasChildren ? (
                <SidebarGroup
                  item={item}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  isHovered={isHovered}
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

