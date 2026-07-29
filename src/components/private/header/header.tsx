"use client";

import { HeaderToggle } from './HeaderToggle';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default function WelcomeHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-sm border-b border-border shrink-0 text-foreground">
      <div className="px-1 lg:px-3 2xl:px-8">
        <div className="flex justify-between items-center h-12 md:h-12">
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
    </header>
  );
}
