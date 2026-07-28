"use client";

import { useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from './sidebar.config';
import {
  MenuItem,
  MenuSection,
  MENU_SECTION_LABELS,
  MENU_SECTION_ORDER,
} from './sidebar.types';
import { SidebarItem } from './SidebarItem';
import { SidebarGroup } from './SidebarGroup';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { getIcon } from './sidebar.icons';

function canSeeItem(hasPermission: (p: string) => boolean, item: MenuItem): boolean {
  if (!item.permission) return true;
  return hasPermission(item.permission);
}

function filterMenuByPermissions(
  items: MenuItem[],
  hasPermission: (p: string) => boolean
): MenuItem[] {
  return items
    .map((item) => {
      if (item.children) {
        const visibleChildren = item.children.filter((child) =>
          canSeeItem(hasPermission, child)
        );
        if (visibleChildren.length === 0) return null;
        if (!canSeeItem(hasPermission, item)) return null;
        return { ...item, children: visibleChildren };
      }
      return canSeeItem(hasPermission, item) ? item : null;
    })
    .filter((item): item is MenuItem => item !== null)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

function isPathActive(
  pathname: string,
  href: string | undefined,
  match: MenuItem['activeMatch'] = 'exact'
): boolean {
  if (!href) return false;
  if (match === 'prefix') {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

function getActiveChildHref(pathname: string, item: MenuItem): string | undefined {
  if (!item.children) return undefined;

  const exact = item.children.find(
    (child) => child.href && pathname === child.href
  );
  if (exact?.href) return exact.href;

  const prefixMatches = item.children
    .filter(
      (child) =>
        child.href &&
        (child.activeMatch ?? 'exact') === 'prefix' &&
        (pathname === child.href || pathname.startsWith(`${child.href}/`))
    )
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0));

  return prefixMatches[0]?.href;
}

function isItemActive(pathname: string, item: MenuItem): boolean {
  if (item.href && isPathActive(pathname, item.href, item.activeMatch)) {
    return true;
  }
  return Boolean(getActiveChildHref(pathname, item));
}

type SectionBucket = {
  section: MenuSection | 'other';
  label: string | null;
  items: MenuItem[];
};

function groupBySection(items: MenuItem[]): SectionBucket[] {
  const buckets = new Map<MenuSection | 'other', MenuItem[]>();

  for (const item of items) {
    const key = item.section ?? 'other';
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  const result: SectionBucket[] = [];
  for (const section of MENU_SECTION_ORDER) {
    const sectionItems = buckets.get(section);
    if (!sectionItems?.length) continue;
    result.push({
      section,
      label: MENU_SECTION_LABELS[section],
      items: sectionItems,
    });
  }

  const other = buckets.get('other');
  if (other?.length) {
    result.push({ section: 'other', label: null, items: other });
  }

  return result;
}

export function SidebarMenu() {
  const { isCollapsed } = useSidebar();
  const { hasPermission } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  /** Sections open by default; user can collapse each one. */
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const pathname = usePathname();
  const ChevronIcon = getIcon('chevron');

  const visibleItems = useMemo(
    () => filterMenuByPermissions(menuItems, hasPermission),
    [hasPermission]
  );

  const sections = useMemo(() => groupBySection(visibleItems), [visibleItems]);

  // Auto-expand menu groups that contain the current route
  useEffect(() => {
    const activeGroups = visibleItems
      .filter((item) => item.children?.length && isItemActive(pathname, item))
      .map((item) => item.name);

    if (activeGroups.length === 0) return;

    setExpandedItems((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const name of activeGroups) {
        if (!next.has(name)) {
          next.add(name);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname, visibleItems]);

  // If current route lives in a collapsed section, open that section
  useEffect(() => {
    const activeSectionKeys = sections
      .filter((bucket) =>
        bucket.items.some((item) => isItemActive(pathname, item))
      )
      .map((bucket) => bucket.section);

    if (activeSectionKeys.length === 0) return;

    setCollapsedSections((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const key of activeSectionKeys) {
        if (next.has(key)) {
          next.delete(key);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname, sections]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemName)) next.delete(itemName);
      else next.add(itemName);
      return next;
    });
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  return (
    <nav className="min-h-0 py-3 px-2 overflow-y-auto overflow-x-hidden scrollbar-none">
      <div className="w-60 space-y-3">
        {sections.map((bucket) => {
          const sectionKey = bucket.section;
          const isSectionCollapsed = collapsedSections.has(sectionKey);
          const showItems = !isSectionCollapsed;

          return (
            <div key={sectionKey}>
              {bucket.label && !isCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between gap-2 px-3 mb-1.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider text-fg-muted hover:bg-surface-muted hover:text-foreground transition-colors"
                  aria-expanded={!isSectionCollapsed}
                  title={
                    isSectionCollapsed
                      ? `Expandir ${bucket.label}`
                      : `Minimizar ${bucket.label}`
                  }
                >
                  <span className="truncate text-left">{bucket.label}</span>
                  <ChevronIcon
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isSectionCollapsed ? '' : 'rotate-90'
                    }`}
                  />
                </button>
              )}

              {bucket.label && isCollapsed && (
                <div
                  className="mx-2 mb-1.5 border-t border-sidebar-border"
                  aria-hidden
                />
              )}

              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  showItems || isCollapsed
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <ul className="space-y-1">
                  {bucket.items.map((item) => {
                    const isActive = isItemActive(pathname, item);
                    const isHovered = hoveredItem === item.name;
                    const isExpanded = expandedItems.has(item.name);
                    const hasChildren = Boolean(item.children?.length);
                    const activeChildHref = hasChildren
                      ? getActiveChildHref(pathname, item)
                      : undefined;

                    return (
                      <li key={item.name} className="relative">
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
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
