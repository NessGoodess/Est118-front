'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    const [isOpen, setIsOpen] = useState(true); // Abierto por defecto en desktop
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            
            if (mobile) {
                setIsOpen(false); // Oculto por defecto en móvil
                setIsCollapsed(false);
            } else {
                setIsOpen(true); // Abierto por defecto en desktop
                setIsCollapsed(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            // En móvil: simple toggle
            setIsOpen(!isOpen);
        } else {
            // En desktop: toggle entre abierto/colapsado
            if (isOpen && !isCollapsed) {
                // Si está abierto, lo colapsa
                setIsCollapsed(true);
            } else {
                // Si está colapsado, lo abre
                setIsOpen(true);
                setIsCollapsed(false);
            }
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
        <SidebarContext.Provider value={{
            isOpen,
            isCollapsed,
            isMobile,
            toggleSidebar,
            openSidebar,
            closeSidebar,
        }}>
            {children}
        </SidebarContext.Provider>
    );
};