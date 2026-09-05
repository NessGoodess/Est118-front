"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

export const ScrollContext = createContext({
    scrolled: false,
    scrollY: 0,
    visible: true,
});

export const useScroll = () => useContext(ScrollContext);

/** Sticky toolbars sit under the compact header while it is visible. */
const STICKY_TOP_VISIBLE = "var(--public-header-h-compact)";
const STICKY_TOP_HIDDEN = "0px";

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setScrollY(currentScrollY);
                    setScrolled(currentScrollY > 36);
                    setVisible(currentScrollY < lastScrollY.current || currentScrollY < 500);
                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Keep sticky filter bars flush with the viewport when the fixed header slides away.
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--public-sticky-top",
            visible ? STICKY_TOP_VISIBLE : STICKY_TOP_HIDDEN
        );
    }, [visible]);

    return (
        <ScrollContext.Provider value={{ scrolled, scrollY, visible }}>
            {children}
        </ScrollContext.Provider>
    );
};
