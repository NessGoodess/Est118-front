"use client";
import React, { useState, useCallback, useEffect } from "react";
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
        description: "Comunicados y avisos institucionales"
    },
    {
        href: "#boletas",
        label: "Boletas y Calificaciones",
        icon: "📊",
        description: "Consulta de rendimiento académico"
    },
    {
        href: "#calendario",
        label: "Calendario Escolar",
        icon: "📅",
        description: "Eventos y fechas importantes"
    },
    {
        href: "#formatos",
        label: "Formatos y Documentos",
        icon: "📥",
        description: "Descargas administrativas"
    },
    {
        href: "#constancias",
        label: "Constancias",
        icon: "📜",
        description: "Solicitud de documentos oficiales"
    },
    {
        href: "#avisos",
        label: "Avisos por Grupo",
        icon: "📢",
        description: "Información específica por grado"
    }
];

const Icon = ({ children, className = "w-5 h-5" }: { children: React.ReactNode, className?: string }) => (
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
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white shadow-lg"
                    : "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-transparent backdrop-blur-md"
            }`}
        >
            {/* Top Bar - Contact Information */}
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
                }`}
            >
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 border-b border-blue-700/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between py-2.5">
                            <div className="flex items-center gap-4 text-blue-100 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    <span className="font-medium">Lunes - Viernes: 7:00 - 14:00</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 lg:gap-5">
                                <a
                                    href="mailto:est188@est118.edu.mx"
                                    className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-xs group"
                                >
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="hidden md:inline font-medium">est188@est118.edu.mx</span>
                                </a>
                                
                                <a
                                    href="tel:+529515134204"
                                    className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-xs group"
                                >
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium">951 513 4204</span>
                                </a>
                                
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-xs group"
                                >
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="hidden lg:inline font-medium">Reforma, Oaxaca</span>
                                    <span className="lg:hidden font-medium">Ubicación</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${
                    scrolled ? "h-20" : "h-24"
                }`}>
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
                        <div className={`relative flex-shrink-0 transition-all duration-300 ${
                            scrolled ? "w-14 h-14" : "w-20 h-20"
                        }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-20 blur-lg"></div>
                            <Image
                                src="/Logo_EST118.png"
                                alt="Logo EST 118"
                                width={scrolled ? 56 : 80}
                                height={scrolled ? 56 : 80}
                                className="relative w-full h-full object-contain rounded-xl shadow-lg"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <h1 className={`font-bold tracking-tight transition-all duration-300 ${
                                scrolled 
                                    ? "text-slate-900 " 
                                    : "text-white text-sm drop-shadow-lg"
                            }`}>
                                EST
                            </h1>
                            <p className={`font-medium tracking-wide transition-all duration-300 ${
                                scrolled 
                                    ? "text-slate-600 text-sm" 
                                    : "text-blue-100 text-sm lg:text-base drop-shadow-md"
                            }`}>
                                #118
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => link.href.startsWith('#') ? handleScrollTo(link.href) : window.location.href = link.href}
                                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    scrolled
                                        ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                        : "text-white hover:text-blue-200 hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4 transition-transform group-hover:scale-110">
                                    {link.icon}
                                </Icon>
                                <span>{link.label}</span>
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-3/4 transition-all duration-300`}></div>
                            </button>
                        ))}

                        {/* Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <button
                                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    scrolled
                                        ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                        : "text-white hover:text-blue-200 hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </Icon>
                                <span>Servicios</span>
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
                            <div className={`absolute top-full right-0 mt-3 w-80 transition-all duration-200 ${
                                servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                            }`}>
                                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-4">
                                        <h3 className="font-bold text-white text-lg">Servicios Estudiantiles</h3>
                                        <p className="text-blue-100 text-sm mt-1">Plataforma de recursos académicos</p>
                                    </div>
                                    <div className="py-2">
                                        {studentServicesLinks.map((service) => (
                                            <button
                                                key={service.href}
                                                onClick={() => handleScrollTo(service.href)}
                                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 text-left group"
                                            >
                                                <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{service.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                                        {service.label}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-0.5">
                                                        {service.description}
                                                    </div>
                                                </div>
                                                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                scrolled
                                    ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-300"
                                    : "text-white hover:bg-white/10 border border-white/20"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Buscar</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`xl:hidden p-2.5 rounded-lg transition-all duration-200 ${
                                scrolled
                                    ? "text-slate-800 hover:bg-slate-100"
                                    : "text-white hover:bg-white/20"
                            }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`xl:hidden transition-all duration-300 overflow-hidden ${
                mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className={`border-t ${
                    scrolled ? "bg-white border-slate-200" : "bg-slate-900/95 border-slate-700/50 backdrop-blur-md"
                }`}>
                    <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => {
                                    if (link.href.startsWith('#')) {
                                        handleScrollTo(link.href);
                                    } else {
                                        window.location.href = link.href;
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${
                                    scrolled
                                        ? "text-slate-800 hover:bg-blue-50 hover:text-blue-600"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-5 h-5">
                                    {link.icon}
                                </Icon>
                                <span>{link.label}</span>
                            </button>
                        ))}

                        {/* Mobile Services Section */}
                        <div className={`pt-2 mt-2 border-t ${scrolled ? "border-slate-200" : "border-slate-700/50"}`}>
                            <button
                                onClick={() => setServicesOpen(!servicesOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    scrolled
                                        ? "text-slate-800 hover:bg-blue-50"
                                        : "text-white hover:bg-white/10"
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
                                <div className="mt-2 space-y-1 ml-2">
                                    {studentServicesLinks.map((service) => (
                                        <button
                                            key={service.href}
                                            onClick={() => handleScrollTo(service.href)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                                                scrolled
                                                    ? "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                                                    : "text-white/90 hover:bg-white/10"
                                            }`}
                                        >
                                            <span className="text-lg">{service.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{service.label}</div>
                                                <div className={`text-xs mt-0.5 ${scrolled ? "text-slate-500" : "text-white/60"}`}>
                                                    {service.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}