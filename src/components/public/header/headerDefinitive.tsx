"use client";
import React, { useState } from "react";
import { useScroll } from "@/contexts/ScrollProvider";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import Image from "next/image";

// Componente de Icono reutilizable
const Icon = ({ children, className = "w-5 h-5" }: { children: React.ReactNode; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);


const mapsUrl = "https://maps.app.goo.gl/K1ca1DwxrsoBiZLL6";
const navLinks = [
    {
        href: "#inicio",
        label: "Inicio",
        icon: (
            <>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </>
        ),
    },
    {
        href: "#eventos",
        label: "Eventos",
        icon: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </>
        ),
    },
    {
        href: "#avisos",
        label: "Avisos",
        icon: (
            <>
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </>
        ),
    },
    {
        href: "#calendario",
        label: "Calendario",
        icon: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
            </>
        ),
    },
    {
        href: "#contacto",
        label: "Contacto",
        icon: (
            <>
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
            </>
        ),
    },
];

export default function Header() {
    const { scrolled, visible } = useScroll();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header
                role="banner"
                className={`fixed inset-x-0 z-50 transition-all duration-500 ease-out 
                    ${scrolled
                        ? "bg-surface-elevated shadow-2xl shadow-black/10"
                        : "transparent"
                    }
                    ${visible ? "translate-y-0" : "-translate-y-full"}
                `}
            >
                <div className="mx-auto max-w-screen-2xl px-4 flex items-center justify-between">
                    {/* Logo y Nombre */}
                    <motion.div
                        className="flex items-center space-x-3 relative py-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: scrolled ? 0.9 : 1,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {/* Logo - visible solo cuando no hay scroll */}
                        <AnimatePresence mode="wait">
                            {!scrolled && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="w-20 h-20 md:w-24 md:h-24 z-20 relative group"
                                >
                                    <Image
                                        src="/logo.PNG"
                                        alt="Logo Escuela Secundaria Técnica 118"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgb(255,255,255)]"
                                        priority
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* School Name */}
                        <motion.div
                            className="flex flex-col"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <motion.h1
                                className={`font-bold transition-all duration-300 ${scrolled
                                    ? "text-foreground text-lg md:text-xl"
                                    : "text-white text-xl md:text-3xl drop-shadow-lg"
                                    }`}
                                id="school-name"
                                itemProp="name"
                            >
                                Técnica 118
                            </motion.h1>
                            <motion.p
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-fg-muted text-xs"
                                    : "text-white/90 text-sm md:text-base drop-shadow-md"
                                    }`}
                                id="school-subtitle"
                                itemProp="description"
                            >
                                Escuela Secundaria Técnica
                            </motion.p>
                        </motion.div>
                    </motion.div>
                    <div className="flex flex-col">
                        <AnimatePresence>
                            {!scrolled && (
                                <motion.div
                                    initial={{ opacity: 0, y: -100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -100 }}
                                    transition={{ duration: 0.3 }}
                                    className="right-0 z-[60] bg-level-3 text-white text-sm py-2 hidden md:block"
                                >
                                    <div className="container mx-auto px-6 flex items-center justify-end">
                                        <div className="flex items-center gap-6">
                                            <a
                                                href="mailto:est188@est118.edu.mx"
                                                className="flex items-center gap-2 hover:text-brand-200 transition-colors"
                                                aria-label="Enviar correo electrónico"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span>est188@est118.edu.mx</span>
                                            </a>
                                            <a
                                                href="tel:+529512003147"
                                                className="flex items-center gap-2 hover:text-brand-200 transition-colors"
                                                aria-label="Llamar por teléfono"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span>951 200 3147</span>
                                            </a>
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                className="flex items-center gap-2 hover:text-brand-200 transition-colors"
                                                aria-label="Nuestra Ubicacion"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
                                                </svg>
                                                <span>Oaxaca</span>
                                            </a>
                                            <a
                                                className="flex items-center gap-2 hover:text-brand-200 transition-colors"
                                                aria-label="Hora de Atencion"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                                <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
                                                <span>7:00 - 14:00</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>       
                            )}
                        </AnimatePresence>
                        <div className="flex justify-end h-20">
                            {/* Navegación Desktop */}
                            <nav
                                className="hidden lg:flex items-center"
                                role="navigation"
                                aria-label="Navegación principal"
                            >
                                <motion.ul
                                    className="flex items-center"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.2,
                                            },
                                        },
                                    }}
                                >
                                    {navLinks.map((link) => (
                                        <motion.li
                                            key={link.href}
                                            variants={{
                                                hidden: {
                                                    opacity: 0,
                                                    y: 50,
                                                    scale: 0.9,
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                    transition: {
                                                        duration: 0.6,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    },
                                                },
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                y: -2,
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <a
                                                href={link.href}
                                                className={`flex items-center gap-2 transition-all duration-300 font-semibold relative group ${scrolled ? "text-foreground px-3 py-1.5" : "text-white px-4 py-2"}`}
                                                aria-label={`Ir a ${link.label}`}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <span className="flex-shrink-0">
                                                        <Icon className={scrolled ? "w-4 h-4" : "w-5 h-5"}>
                                                            {link.icon}
                                                        </Icon>
                                                    </span>
                                                    <span>{link.label}</span>
                                                </span>
                                                <motion.span
                                                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? "bg-primary" : "bg-surface-elevated"}`}
                                                    initial={{ scaleX: 0 }}
                                                    whileHover={{ scaleX: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </a>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </nav>

                            {/* Búsqueda y Menú móvil */}
                            <div className="w-72 flex justify-end items-center gap-3 ">
                                <SearchBar scrolled={scrolled} />

                                {/* Botón menú móvil */}
                                <motion.button
                                    type="button"
                                    aria-label="Abrir menú de navegación"
                                    aria-expanded={mobileOpen}
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${scrolled
                                        ? "text-foreground hover:bg-surface-muted"
                                        : "text-white hover:bg-surface-elevated/20"
                                        }`}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <motion.svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        animate={{ rotate: mobileOpen ? 90 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {mobileOpen ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        )}
                                    </motion.svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menú móvil desplegable */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden overflow-hidden"
                            role="navigation"
                            aria-label="Menú móvil"
                        >
                            <div className={`px-6 py-4 space-y-2 ${scrolled
                                ? "bg-surface-elevated"
                                : "bg-[#2b459c]"
                                }`}>
                                {navLinks.map((link) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-all ${scrolled
                                            ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                            : "text-white hover:bg-surface-elevated/20"
                                            }`}
                                        onClick={() => setMobileOpen(false)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="flex-shrink-0">
                                            <Icon className="w-5 h-5">
                                                {link.icon}
                                            </Icon>
                                        </span>
                                        <span>{link.label}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}