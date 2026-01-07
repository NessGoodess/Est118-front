"use client";

import { HeaderToggle } from './HeaderToggle';
import { HeaderLogo } from './HeaderLogo';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderSearch } from './HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default function WelcomeHeader() {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
      {/* Primera fila: Toggle, Logo, Búsqueda, Notificaciones */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Izquierda: Toggle + Logo */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <HeaderToggle />
            {/*<HeaderLogo />*/}
          </div>
          
          {/* Centro: Búsqueda (solo desktop) */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <HeaderSearch />
          </div>
          
          {/* Derecha: Acciones */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notificaciones - Solo desktop */}
            <div className="hidden md:block">
              <HeaderNotifications count={0} />
            </div>
            
            {/* Menú móvil */}
            <HeaderMobileMenu />
          </div>
        </div>
      </div>

      {/* Segunda fila: Breadcrumbs (solo desktop) */}
      <div className="hidden md:block px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="h-10 flex items-center">
          <HeaderBreadcrumbs />
        </div>
      </div>

      {/* Búsqueda móvil (debajo del header principal) */}
      <div className="lg:hidden px-4 pb-3 border-t border-gray-100">
        <HeaderSearch />
      </div>
    </header>
  );
}
