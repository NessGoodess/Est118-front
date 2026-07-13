"use client";

import { HeaderToggle } from './HeaderToggle';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default function WelcomeHeader() {
  return (
    <header className="bg-background border-b border-gray-200 block top-0 z-30">

      <div className="bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

      <div className="bg-gradient-to-t from-blue-100 to-white hidden md:block px-4 sm:px-6 lg:px-8">
        <div className="h-10 flex items-center">
          <HeaderBreadcrumbs />
        </div>
      </div>

    </header>
  );
}
