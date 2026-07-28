'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: false,
  isCollapsed: false,
  isMobile: false,
  toggleSidebar: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
        setIsCollapsed(false);
      } else {
        setIsOpen(true);
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else if (isOpen && !isCollapsed) {
      setIsCollapsed(true);
    } else {
      setIsOpen(true);
      setIsCollapsed(false);
    }
  };

  const openSidebar = () => {
    if (!isMobile) {
      setIsOpen(true);
      setIsCollapsed(false);
    }
  };

  const closeSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        isMobile,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
