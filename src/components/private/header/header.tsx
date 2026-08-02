"use client";

import { HeaderToggle } from "./HeaderToggle";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderNotifications } from "./HeaderNotifications";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

export default function WelcomeHeader() {
  return (
    <header className="sticky top-0 z-30 shrink-0 flex h-14 items-center border-b border-border bg-surface-panel text-foreground backdrop-blur-sm">
        <div className="flex shrink-0 items-center">
          <HeaderToggle />
        </div> 
        <div className="relative flex min-w-0 flex-1 items-center justify-between">
          <HeaderSearch />
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:ml-auto">
            <ThemeSwitch />
            <HeaderNotifications />
          </div>
        </div>

    </header>
  );
}
