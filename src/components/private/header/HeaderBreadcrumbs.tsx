"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from '../sidebar/sidebar.config';
import { MenuItem } from '../sidebar/sidebar.types';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Función para encontrar el item del menú por href
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

// Función para generar breadcrumbs desde el pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  const segments = pathname.split('/').filter(Boolean);

  // Construir breadcrumbs progresivamente
  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    
    // Buscar el item en el menú
    const menuItem = findMenuItemByHref(currentPath, menuItems);
    
    if (menuItem) {
      breadcrumbs.push({
        label: menuItem.name,
        href: currentPath,
      });
    } else {
      // Si no está en el menú, generar label desde el segmento
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
    return null; // No mostrar breadcrumbs si no hay ninguno
  }

  return (
    <nav className="hidden md:flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
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
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
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

