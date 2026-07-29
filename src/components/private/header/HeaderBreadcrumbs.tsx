"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from '../sidebar/sidebar.config';
import { MenuItem } from '../sidebar/sidebar.types';

interface BreadcrumbItem {
  label: string;
  href: string;
}

function findMenuItemByHref(href: string, items: MenuItem[]): MenuItem | null {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children) {
      const found = findMenuItemByHref(href, item.children);
      if (found) return found;
    }
  }
  return null;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  const segments = pathname.split('/').filter(Boolean);

  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;

    const menuItem = findMenuItemByHref(currentPath, menuItems);

    if (menuItem) {
      breadcrumbs.push({
        label: menuItem.name,
        href: currentPath,
      });
    } else {
      const label = segments[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    }
  }

  return breadcrumbs;
}

export function HeaderBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="hidden md:flex items-center space-x-2 text-[10px] text-fg-muted mx-2 py-1" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-2 h-2 text-fg-muted mx-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-foreground font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-fg-muted hover:text-foreground transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
