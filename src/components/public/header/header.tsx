"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { navLinks, studentServicesLinks } from "./header.config";
import { IconByName } from "@/components/ui/icons";
import TopBar from "./topBar";
import PublicHeaderSearch from "./PublicHeaderSearch";
import { useAdmissionPublicStatus } from "@/features/admissions/context/admission-public-status-context";
import { useScroll } from "@/contexts/ScrollProvider";

const navEase = [0.16, 1, 0.3, 1] as const;
const HEADER_COMPACT_SCROLL = 72;

const navItemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: navEase },
    },
};

export default function Header() {
    const router = useRouter();
    const { scrolled, scrollY, visible } = useScroll();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { navLabel } = useAdmissionPublicStatus();
    const menuOpenScrollY = useRef(0);

    const rawScroll = useMotionValue(0);

    useEffect(() => {
        rawScroll.set(scrollY);
    }, [scrollY, rawScroll]);

    useEffect(() => {
        if (!mobileOpen && !servicesOpen) return;
        if (Math.abs(scrollY - menuOpenScrollY.current) < 10) return;
        setMobileOpen(false);
        setServicesOpen(false);
    }, [scrollY, mobileOpen, servicesOpen]);

    const openMobileMenu = () => {
        menuOpenScrollY.current = scrollY;
        setMobileOpen(true);
    };

    const toggleMobileMenu = () => {
        if (mobileOpen) {
            setMobileOpen(false);
            setServicesOpen(false);
            return;
        }
        openMobileMenu();
    };

    const mainHeight = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [96, 72]
    );
    const logoSize = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [80, 52]
    );
    const topBarHeight = useTransform(rawScroll, [0, 56], [44, 0]);
    const topBarOpacity = useTransform(rawScroll, [0, 48], [1, 0]);
    const heroBgOpacity = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [1, 0]
    );
    const compactBgOpacity = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [0, 1]
    );
    const headerShadow = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [0, 0.12]
    );
    const headerBoxShadow = useTransform(
        headerShadow,
        (value) => `0 16px 40px rgba(0, 0, 0, ${value})`
    );
    const logoGlowOpacity = useTransform(
        rawScroll,
        [0, HEADER_COMPACT_SCROLL],
        [0.2, 0.08]
    );

    const links = navLinks.map((link) =>
        link.href === "/inscripciones" ? { ...link, label: navLabel } : link
    );

    const handleServiceNavigate = useCallback(
        (href: string) => {
            if (href.startsWith("#")) {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            } else {
                router.push(href);
            }
            setMobileOpen(false);
            setServicesOpen(false);
        },
        [router]
    );

    const navLinkClass = (compact = false) =>
        `group relative flex items-center gap-2 font-medium transition-[color,background-color,border-color] duration-200 ease-out ${compact ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm"
        } ${scrolled
            ? "text-foreground hover:text-primary hover:bg-primary-soft rounded-lg"
            : "text-public-on-media hover:text-brand-100 hover:bg-public-glass rounded-lg"
        }`;

    return (
        <motion.header
            role="banner"
            animate={{ y: visible || mobileOpen ? 0 : "-100%" }}
            transition={{ duration: 0.28, ease: navEase }}
            className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
            style={{ boxShadow: headerBoxShadow }}
        >
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 "
                style={{ opacity: heroBgOpacity }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-surface-elevated"
                style={{ opacity: compactBgOpacity }}
            />

            <motion.div
                className="relative overflow-hidden max-lg:!h-0 max-lg:!opacity-0 max-lg:!pointer-events-none"
                style={{ height: topBarHeight, opacity: topBarOpacity }}
            >
                <TopBar />
            </motion.div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="flex items-center justify-between max-lg:!h-16"
                    style={{ height: mainHeight }}
                >
                    <div className="flex items-center gap-4 py-1">
                        <motion.div
                            className="relative shrink-0 group max-lg:!h-12 max-lg:!w-12"
                            style={{ width: logoSize, height: logoSize }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 blur-lg"
                                style={{ opacity: logoGlowOpacity }}
                            />
                            <Image
                                src="/Logo_EST118.png"
                                alt="Logo EST 118"
                                fill
                                sizes="80px"
                                className="relative rounded-xl object-contain shadow-lg transition-[filter] duration-500 group-hover:drop-shadow-[0_0_8px_rgb(255,255,255,0.35)]"
                                priority
                            />
                        </motion.div>
                    </div>

                    <nav
                        className="hidden xl:flex items-center gap-1"
                        role="navigation"
                        aria-label="Navegación principal"
                    >
                        <motion.ul
                            className="flex items-center gap-1"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                                },
                            }}
                        >
                            {links.map((link) => (
                                <motion.li
                                    key={link.href}
                                    variants={navItemVariants}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={link.href} className={navLinkClass(scrolled)}>
                                        <IconByName
                                            name={link.icon}
                                            className={`${scrolled ? "w-4 h-4" : "w-5 h-5"} transition-transform group-hover:scale-110`}
                                        />
                                        <span>{link.label}</span>
                                        <motion.span
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? "bg-primary" : "bg-public-glass-strong/80"
                                                }`}
                                            initial={{ scaleX: 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </Link>
                                </motion.li>
                            ))}

                            <motion.li
                                variants={navItemVariants}
                                className="relative"
                                onMouseEnter={() => {
                                    menuOpenScrollY.current = scrollY;
                                    setServicesOpen(true);
                                }}
                                onMouseLeave={() => setServicesOpen(false)}
                            >
                                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="#" className={navLinkClass(scrolled)} onClick={(e) => e.preventDefault()}>
                                        <IconByName
                                            name="users"
                                            className={`${scrolled ? "w-4 h-4" : "w-5 h-5"} transition-transform group-hover:scale-110`}
                                        />
                                        <span>Servicios</span>
                                        <IconByName
                                            name="chevronDown"
                                            className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                                        />
                                    </Link>
                                </motion.div>

                                <div
                                    className={`absolute top-full right-0 z-50 w-80 pt-3 transition-opacity duration-200 ${servicesOpen
                                        ? "pointer-events-auto opacity-100"
                                        : "pointer-events-none opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl">
                                        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-600 p-4">
                                            <h3 className="text-lg font-bold text-public-on-media">Servicios</h3>
                                            <p className="mt-1 text-sm text-brand-100">Recursos académicos</p>
                                        </div>
                                        <div className="py-2">
                                            {studentServicesLinks.map((service) => (
                                                <button
                                                    key={service.href}
                                                    type="button"
                                                    onClick={() => handleServiceNavigate(service.href)}
                                                    className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-primary-soft"
                                                >
                                                    <IconByName
                                                        name={service.icon}
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:scale-110"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            {service.label}
                                                        </div>
                                                        <div className="mt-0.5 text-xs text-fg-muted">{service.description}</div>
                                                    </div>
                                                    <IconByName
                                                        name="chevronRight"
                                                        className="h-4 w-4 text-fg-muted transition-all group-hover:translate-x-1 group-hover:text-primary"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        </motion.ul>
                    </nav>

                    <div className="flex items-center gap-3">
                        <motion.button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Buscar en el sitio"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-[color,background-color,border-color] duration-200 ease-out ${scrolled
                                ? "border-border text-foreground hover:bg-primary-soft hover:text-primary"
                                : "border-public-glass-border text-public-on-media hover:bg-public-glass"
                                }`}
                        >
                            <IconByName name="search" className="h-4 w-4" />
                            <span className="hidden sm:inline">Buscar</span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={toggleMobileMenu}
                            aria-label="Menú principal"
                            aria-expanded={mobileOpen}
                            whileTap={{ scale: 0.9 }}
                            className={`rounded-lg p-2.5 transition-all duration-300 xl:hidden ${scrolled
                                ? "text-foreground hover:bg-surface-muted"
                                : "text-public-on-media hover:bg-public-glass"
                                }`}
                        >
                            <motion.div
                                animate={{ rotate: mobileOpen ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IconByName name={mobileOpen ? "x" : "menu"} className="h-6 w-6" />
                            </motion.div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden xl:hidden"
                        role="navigation"
                        aria-label="Menú móvil"
                    >
                        <div
                            className={`border-t ${scrolled
                                ? "border-border bg-surface-elevated"
                                : "border-brand-700/50 bg-brand-900/95 backdrop-blur-md"
                                }`}
                        >
                            <div className="max-h-[min(70dvh,calc(100dvh-5rem))] space-y-1 overflow-y-auto px-4 py-3">
                                {links.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => {
                                                setMobileOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left font-medium transition-all duration-200 ${scrolled
                                                ? "text-foreground hover:bg-primary-soft hover:text-primary"
                                                : "text-public-on-media hover:bg-public-glass"
                                                }`}
                                        >
                                            <IconByName name={link.icon} className="h-4 w-4" />
                                            <span>{link.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className={`mt-2 border-t pt-2 ${scrolled ? "border-border" : "border-brand-700/50"}`}>
                                    <motion.button
                                        type="button"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: links.length * 0.05, type: "spring", stiffness: 300 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setSearchOpen(true);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left font-medium transition-all duration-200 ${scrolled
                                            ? "text-foreground hover:bg-primary-soft hover:text-primary"
                                            : "text-public-on-media hover:bg-public-glass"
                                            }`}
                                    >
                                        <IconByName name="search" className="h-4 w-4" />
                                        <span>Buscar en el sitio</span>
                                    </motion.button>
                                </div>

                                <div className={`mt-2 border-t pt-2 ${scrolled ? "border-border" : "border-brand-700/50"}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            menuOpenScrollY.current = scrollY;
                                            setServicesOpen(!servicesOpen);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 font-medium transition-all duration-200 ${scrolled
                                            ? "text-foreground hover:bg-primary-soft"
                                            : "text-public-on-media hover:bg-public-glass"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconByName name="users" className="h-4 w-4" />
                                            <span>Servicios Estudiantiles</span>
                                        </div>
                                        <IconByName
                                            name="chevronDown"
                                            className={`h-5 w-5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {servicesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="ml-2 mt-2 space-y-1 overflow-hidden"
                                            >
                                                {studentServicesLinks.map((service) => (
                                                    <button
                                                        key={service.href}
                                                        type="button"
                                                        onClick={() => handleServiceNavigate(service.href)}
                                                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm transition-all duration-200 ${scrolled
                                                            ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                                            : "text-public-on-media/90 hover:bg-public-glass"
                                                            }`}
                                                    >
                                                        <IconByName name={service.icon} className="h-5 w-5 shrink-0" />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{service.label}</div>
                                                            <div className={`mt-0.5 text-xs ${scrolled ? "text-fg-muted" : "text-public-on-media-muted"}`}>
                                                                {service.description}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            <PublicHeaderSearch scrolled={scrolled} open={searchOpen} onOpenChange={setSearchOpen} />
        </motion.header>
    );
}
