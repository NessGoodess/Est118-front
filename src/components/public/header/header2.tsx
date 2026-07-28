"use client";
import React, { useState, useCallback } from "react";
import { useScroll } from "@/contexts/ScrollProvider";
import Link from "next/link";
import SearchBar from "./SearchBar";
import Image from "next/image";

const mapsUrl = "https://maps.app.goo.gl/K1ca1DwxrsoBiZLL6";

const navLinks = [
    {
        href: "/",
        label: "Inicio",
        icon: (
            <>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </>
        ),
    },
    {
        href: "/noticias",
        label: "Noticias",
        icon: (
            <>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </>
        ),
    },
    {
        href: "/galeria",
        label: "Galería",
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
            </>
        ),
    },
    {
        href: "/eventos",
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
        href: "#ubicacion",
        label: "Ubicación",
        icon: (
            <>
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
            </>
        ),
    },
    {
        href: "/inscripciones",
        label: "Inscripciones 2026",
        icon: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

const studentServicesLinks = [
    {
        href: "#circulares",
        label: "Circulares Oficiales",
        icon: "📄",
        description: "Comunicados oficiales"
    },
    {
        href: "#boletas",
        label: "Boletas / Calificaciones",
        icon: "📝",
        description: "Consulta tus calificaciones"
    },
    {
        href: "#calendario",
        label: "Calendario Escolar",
        icon: "📅",
        description: "Fechas importantes"
    },
    {
        href: "#formatos",
        label: "Descarga de Formatos",
        icon: "📥",
        description: "Formatos y documentos"
    },
    {
        href: "#constancias",
        label: "Constancias",
        icon: "🧾",
        description: "Solicita constancias"
    },
    {
        href: "#avisos",
        label: "Avisos por Grupo",
        icon: "📌",
        description: "Avisos y notificaciones"
    }
];


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

export default function Header() {
    const { scrolled } = useScroll();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const handleScrollTo = useCallback((href: string) => {
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        setMobileOpen(false);
        setServicesOpen(false);
    }, []);


    return (
        <header
            role="banner"
            className={`sticky top-0 z-50 font-montserrat transition-all duration-300 ${scrolled
                ? "bg-surface-elevated/98 backdrop-blur-sm shadow-md"
                : "bg-transparent"
                }`}
        >
            {/* Barra superior con contacto - solo visible cuando no hay scroll */}
            {!scrolled && (
                <div className="bg-[#181d49] text-white text-sm py-2 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-end gap-4 lg:gap-6">
                            <a
                                href="mailto:est188@est118.edu.mx"
                                className="flex items-center gap-1.5 hover:text-brand-200 transition-colors text-xs lg:text-sm"
                                aria-label="Enviar correo electrónico"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">est188@est118.edu.mx</span>
                                <span className="sm:hidden">Email</span>
                            </a>
                            <a
                                href="tel:+529515134204"
                                className="flex items-center gap-1.5 hover:text-brand-200 transition-colors text-xs lg:text-sm"
                                aria-label="Llamar por teléfono"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>951 513 4204</span>
                            </a>
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-brand-200 transition-colors text-xs lg:text-sm"
                                aria-label="Nuestra Ubicación"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 lg:h-4 lg:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                <span className="hidden sm:inline">Oaxaca</span>
                            </a>
                            <div className="flex items-center gap-1.5 text-xs lg:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 lg:h-4 lg:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
                                </svg>
                                <span>7:00 - 14:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 lg:h-24">
                    {/* Logo y Nombre */}
                    <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
                        {!scrolled && (
                            <div className="w-16 h-16 lg:w-20 lg:h-20 relative flex-shrink-0">
                                <Image
                                    src="/logo.PNG"
                                    alt="Logo Escuela Secundaria Técnica 118"
                                    className="w-full h-full object-contain drop-shadow-lg"
                                    width={80}
                                    height={80}
                                    loading="eager"
                                />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h1 className={`font-bold transition-colors duration-300 ${scrolled
                                ? "text-foreground text-base lg:text-lg"
                                : "text-white text-lg lg:text-2xl drop-shadow-lg"
                                }`}>
                                Técnica 118
                            </h1>
                            <p className={`transition-colors duration-300 ${scrolled
                                ? "text-fg-muted text-xs"
                                : "text-white/90 text-xs lg:text-sm drop-shadow-md"
                                }`}>
                                Escuela Secundaria Técnica
                            </p>
                        </div>
                    </div>

                    {/* Navegación Desktop */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {navLinks.map((link) => (
                            link.href.startsWith('/') ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`group flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${scrolled
                                        ? "text-foreground hover:text-primary hover:bg-surface-muted"
                                        : "text-white hover:text-brand-100 hover:bg-surface-elevated/10"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 lg:w-5 lg:h-5">
                                        {link.icon}
                                    </Icon>
                                    <span className="text-sm lg:text-base">{link.label}</span>
                                </Link>
                            ) : (
                                <button
                                    key={link.href}
                                    onClick={() => handleScrollTo(link.href)}
                                    className={`group flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${scrolled
                                        ? "text-foreground hover:text-primary hover:bg-surface-muted"
                                        : "text-white hover:text-brand-100 hover:bg-surface-elevated/10"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 lg:w-5 lg:h-5">
                                        {link.icon}
                                    </Icon>
                                    <span className="text-sm lg:text-base">{link.label}</span>
                                </button>
                            )
                        ))}

                        {/* Student Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <button
                                className={`group flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${scrolled
                                    ? "text-foreground hover:text-primary hover:bg-surface-muted"
                                    : "text-white hover:text-brand-100 hover:bg-surface-elevated/10"
                                    }`}
                            >
                                <Icon className="w-4 h-4 lg:w-5 lg:h-5">
                                    <>
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </>
                                </Icon>
                                <span className="text-sm lg:text-base">Servicios</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {servicesOpen && (
                                <div className={`absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl overflow-hidden z-50 ${scrolled ? 'bg-surface-elevated' : 'bg-surface-elevated/98 backdrop-blur-sm'
                                    }`}>
                                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                        <h3 className="font-bold text-sm">Servicios Estudiantiles</h3>
                                        <p className="text-xs opacity-90">Acceso rápido a recursos</p>
                                    </div>
                                    <div className="py-2">
                                        {studentServicesLinks.map((service) => (
                                            <button
                                                key={service.href}
                                                onClick={() => handleScrollTo(service.href)}
                                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-primary-soft transition-colors duration-150 text-left group"
                                            >
                                                <span className="text-2xl flex-shrink-0">{service.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                                                        {service.label}
                                                    </div>
                                                    <div className="text-xs text-fg-muted mt-0.5">
                                                        {service.description}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>


                    {/* Búsqueda y Menú móvil */}
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="hidden lg:block">
                            <SearchBar scrolled={scrolled} />
                        </div>

                        {/* Botón menú móvil */}
                        <button
                            type="button"
                            aria-label="Abrir menú de navegación"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${scrolled
                                ? "text-foreground hover:bg-surface-muted"
                                : "text-white hover:bg-surface-elevated/20"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {mobileOpen && (
                <div className={`lg:hidden border-t transition-colors duration-200 ${scrolled ? "bg-surface-elevated border-border" : "bg-[#181d49]/95 border-white/10 backdrop-blur-sm"
                    }`}>
                    <nav className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            link.href.startsWith('/') ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${scrolled
                                        ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                        : "text-white hover:bg-surface-elevated/10"
                                        }`}
                                >
                                    <Icon className="w-5 h-5">
                                        {link.icon}
                                    </Icon>
                                    <span>{link.label}</span>
                                </Link>
                            ) : (
                                <button
                                    key={link.href}
                                    onClick={() => handleScrollTo(link.href)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-left ${scrolled
                                        ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                        : "text-white hover:bg-surface-elevated/10"
                                        }`}
                                >
                                    <Icon className="w-5 h-5">
                                        {link.icon}
                                    </Icon>
                                    <span>{link.label}</span>
                                </button>
                            )
                        ))}

                        {/* Student Services Mobile Section */}
                        <div className="pt-2 mt-2 border-t border-white/10">
                            <button
                                onClick={() => setServicesOpen(!servicesOpen)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${scrolled
                                    ? "text-foreground hover:bg-surface-muted"
                                    : "text-white hover:bg-surface-elevated/10"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🎓</span>
                                    <span>Servicios Estudiantiles</span>
                                </div>
                                <svg
                                    className={`w-5 h-5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {servicesOpen && (
                                <div className="mt-1 ml-4 space-y-1">
                                    {studentServicesLinks.map((service) => (
                                        <button
                                            key={service.href}
                                            onClick={() => handleScrollTo(service.href)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 text-left ${scrolled
                                                ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                                : "text-white/90 hover:bg-surface-elevated/10"
                                                }`}
                                        >
                                            <span className="text-lg">{service.icon}</span>
                                            <span>{service.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
