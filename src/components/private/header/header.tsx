"use client";

import { HeaderToggle } from './HeaderToggle';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default function WelcomeHeader() {
  return (
    <header className="sticky top-0 z-30 bg-surface-header/95 backdrop-blur-sm border-b border-border shrink-0 text-foreground">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center space-x-4 flex-shrink-0">
            <HeaderToggle />
          </div>

          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <HeaderSearch />
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="hidden md:block">
              <HeaderNotifications />
            </div>
            <HeaderMobileMenu />
          </div>
        </div>
      </div>

      <div className="hidden md:block px-4 sm:px-6 lg:px-8 border-t border-border bg-surface-muted/60">
        <div className="h-9 flex items-center">
          <HeaderBreadcrumbs />
        </div>
      </div>
    </header>
  );
}
