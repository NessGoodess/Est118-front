"use client";
import { useState } from "react";
import { useScroll } from "@/contexts/ScrollProvider";
import Link from "next/link";

interface HeaderProps {
    scrolled: boolean;
    visible: boolean;
}

const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#eventos", label: "Eventos" },
    { href: "#avisos", label: "Avisos" },
    { href: "#calendario", label: "Calendario" },
    { href: "#contacto", label: "Contacto" },
];

export default function Header(){
    const { scrolled, visible } = useScroll();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <div 
                className="fixed top-0 left-0 right-0 z-50 bg-[#181d49] text-white text-sm py-2 hidden md:block"
                style={{ backgroundColor: 'var(--color-level-3)' }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a 
                            href="mailto:est188@est118.edu.mx" 
                            className="flex items-center gap-2 hover:text-blue-300 transition-colors"
                            aria-label="Enviar correo electrónico"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>est188@est118.edu.mx</span>
                        </a>
                        <a 
                            href="tel:+529512003147" 
                            className="flex items-center gap-2 hover:text-blue-300 transition-colors"
                            aria-label="Llamar por teléfono"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>951 200 3147</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Header principal */}
            <header
                className={`fixed left-0 right-0 z-40 transition-all duration-300 
                    ${scrolled ? "py-4" : "py-6"}
                    top-0 md:top-[40px]
                    ${scrolled ? "bg-white bg-opacity-80 backdrop-blur-md shadow-lg text-black" : "bg-transparent"}
                    ${visible ? "translate-y-0" : "-translate-y-full"}
                `}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo y Nombre */}
                <div className="flex items-center space-x-3 relative">
                    <div className={`${scrolled ? "w-12 h-12" : "w-24 h-24"} absolute z-10 bg-white opacity-5 rounded-full flex items-center justify-center transition-all duration-300`}></div>
                    <div className={`${scrolled ? "w-12 h-12" : "w-24 h-24"} z-20 bg-transparent rounded-full flex items-center justify-center transition-all duration-300`}>
                        <span aria-label="Logo" role="img" className="drop-shadow-custom">
                            {/*<i className="fas fa-graduation-cap text-white text-xl"></i>*/}
                            <img src="/logo.png" alt="Logo tecnica 118" className="drop-shadow-2xl"/>
                        </span>
                    </div>
                    <div>
                        <h1 className={`${scrolled ? "text-black text-lg" : "text-white text-2xl"} font-bold text-shadow-black`} id="school-name">
                            Técnica 118
                        </h1>
                        <p className={`${scrolled ? "text-black text-xs" : "text-white text-sm"}`} id="school-subtitle">
                            Escuela Secundaria Técnica
                        </p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`${scrolled ? "text-black" : "text-white"} hover:text-blue-600 transition-colors font-medium`}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Botones de acción 
                <div className="flex space-x-3 ml-4">
                    <Link href={"/login"}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-all flex items-center">
                        <i className="fas fa-desktop mr-2"></i>SICE
                    </button>
                    </Link>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all flex items-center">
                        <i className="fas fa-envelope mr-2"></i>Contacto
                    </button>
                </div>*/}

                {/* Menú móvil */}
                <button
                    aria-label="Abrir menú"
                    className={`md:hidden ${scrolled ? "text-black" : "text-white"}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
            </div>

            {/* Menú móvil desplegable */}
            <div
                className={`md:hidden absolute top-full left-0 w-full transition-all duration-300
          ${mobileOpen ? "block" : "hidden"} bg-white bg-opacity-95 backdrop-blur-md shadow-lg`}
            >
                <div className="px-6 py-4 space-y-3">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="block text-gray-800 hover:text-blue-600 font-medium"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </header>
        </>
    );
};