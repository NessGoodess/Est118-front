"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { navLinks, studentServicesLinks } from "./header.config";
import { IconByName } from "@/components/ui/icons/public/header.icons";
import TopBar from "./topBar";
import Link from "next/link";

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-surface-elevated shadow-lg"
                : "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-transparent backdrop-blur-md"
                }`}
        >
            {/* Top Bar - Contact Information */}
            <TopBar scrolled={scrolled}/>
            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-20" : "h-24"}`}>
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
                        <div className={`relative flex-shrink-0 transition-all duration-300 ${scrolled ? "w-14 h-14" : "w-20 h-20"
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
                        {/*}
                        <div className="flex flex-col">
                            <h1 className={`font-bold tracking-tight transition-all duration-300 ${scrolled
                                ? "text-foreground "
                                : "text-white text-sm drop-shadow-lg"
                                }`}>
                                EST
                            </h1>
                            <p className={`font-medium tracking-wide transition-all duration-300 ${scrolled
                                ? "text-fg-muted text-sm"
                                : "text-brand-100 text-sm lg:text-base drop-shadow-md"
                                }`}>
                                118
                            </p>
                        </div>
                        */}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${scrolled
                                    ? "text-foreground hover:text-primary hover:bg-primary-soft"
                                    : "text-white hover:text-brand-100 hover:bg-surface-elevated/10"
                                    }`}
                            >
                                {IconByName({name:link.icon, className:"w-4 h-4 transition-transform group-hover:scale-110"})}
                                <span>{link.label}</span>
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-3/4 transition-all duration-300`}></div>
                            </Link>
                        ))}

                        {/* Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <Link
                                href="#"
                                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${scrolled
                                    ? "text-foreground hover:text-primary hover:bg-primary-soft"
                                    : "text-white hover:text-brand-100 hover:bg-surface-elevated/10"
                                    }`}
                            >
                                
                                {IconByName({name:"admission", className:"w-4 h-4 transition-transform group-hover:scale-110"})}
                                <span>Servicios</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>

                            {/* Dropdown Menu */}
                            <div className={`absolute top-full right-0 mt-3 w-80 transition-all duration-200 ${servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                <div className="bg-surface-elevated rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-4">
                                        <h3 className="font-bold text-white text-lg">Servicios Estudiantiles</h3>
                                        <p className="text-brand-100 text-sm mt-1">Plataforma de recursos académicos</p>
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
                                                    <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                                                        {service.label}
                                                    </div>
                                                    <div className="text-xs text-foreground0 mt-0.5">
                                                        {service.description}
                                                    </div>
                                                </div>
                                                <svg className="w-4 h-4 text-fg-muted group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${scrolled
                                ? "text-foreground hover:text-primary hover:bg-primary-soft border border-slate-300"
                                : "text-white hover:bg-surface-elevated/10 border border-white/20"
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Buscar</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <Link
                            href=""
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menú principal"
                            className={`xl:hidden p-2.5 rounded-lg transition-all duration-200 ${scrolled
                                ? "text-foreground hover:bg-surface-muted"
                                : "text-white hover:bg-surface-elevated/20"
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`xl:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className={`border-t ${scrolled ? "bg-surface-elevated border-slate-200" : "bg-brand-900/95 border-slate-700/50 backdrop-blur-md"
                    }`}>
                    <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => {
                                    if (link.href.startsWith('#')) {
                                        handleScrollTo(link.href);
                                    } else {
                                        window.location.href = link.href;
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${scrolled
                                    ? "text-foreground hover:bg-primary-soft hover:text-primary"
                                    : "text-white hover:bg-surface-elevated/10"
                                    }`}
                            >
                                {IconByName({name:link.icon, className:"w-4 h-4 transition-transform group-hover:scale-110"})}
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {/* Mobile Services Section */}
                        <div className={`pt-2 mt-2 border-t ${scrolled ? "border-slate-200" : "border-slate-700/50"}`}>
                            <button
                                onClick={() => setServicesOpen(!servicesOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${scrolled
                                    ? "text-foreground hover:bg-primary-soft"
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
                                <div className="mt-2 space-y-1 ml-2">
                                    {studentServicesLinks.map((service) => (
                                        <button
                                            key={service.href}
                                            onClick={() => handleScrollTo(service.href)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${scrolled
                                                ? "text-foreground hover:bg-surface-muted hover:text-primary"
                                                : "text-white/90 hover:bg-surface-elevated/10"
                                                }`}
                                        >
                                            <span className="text-lg">{service.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{service.label}</div>
                                                <div className={`text-xs mt-0.5 ${scrolled ? "text-foreground0" : "text-white/60"}`}>
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