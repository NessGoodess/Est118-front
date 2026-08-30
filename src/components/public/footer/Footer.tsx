"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmissionPublicStatus } from "@/features/admissions/context/admission-public-status-context";

export default function Footer() {
    const { navLabel } = useAdmissionPublicStatus();

    return (
        <footer id="contacto" className="bg-surface-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 relative">
                                    <Image
                                        src="/Logo_EST118.png"
                                        alt="Logo Escuela Secundaria Técnica 118"
                                        className="w-full h-full object-contain"
                                        width={80}
                                        height={80}
                                        loading="eager"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-bold text-white">Técnica 118</span>
                                    <p className="text-gray-300 text-sm">
                                        Escuela Secundaria Técnica
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                Institución educativa comprometida con la excelencia académica y la formación técnica integral de nuestros estudiantes desde 1984.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="https://www.facebook.com/EscSecTecnica118"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/est_118_oax"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                {/*<a
                                    href="#"
                                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="YouTube"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>*/}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#inicio" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        Portal Administrativo
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/galeria" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        Galería
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inscripciones" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        {navLabel}
                                    </Link>
                                </li>
                                <li>
                                    <a href="#notices" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        Avisos y noticias
                                    </a>
                                </li>
                                <li>
                                    <a href="#eventos" className="text-gray-300 hover:text-white transition-colors text-sm">
                                        Eventos
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Contacto</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:est.118.oax@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                                        est.118.oax@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href="tel:+529515134204" className="text-gray-300 hover:text-white transition-colors">
                                        951 513 4204
                                    </a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-gray-300">
                                        Río Tehuantepec 300, Fraccionamiento los Ríos<br />
                                        Oaxaca de Juárez, 68020, Oaxaca
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
                                    </svg>
                                    <span className="text-gray-300">Lun-Vie 7:00-15:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="flex items-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 relative mb-4">
                                        <Image
                                            src="/Logo_IEEPO.png"
                                            alt="Logo IEEPO - Instituto Estatal de Educación Pública de Oaxaca"
                                            className="w-full h-full object-contain"
                                            width={224}
                                            height={224}
                                            loading="eager"
                                            priority
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-yellow-400 font-bold text-lg mb-1">IEEPO</p>
                                        <p className="text-white/80 text-sm">Instituto Estatal de Educación</p>
                                        <p className="text-white/80 text-sm">Pública de Oaxaca</p>
                                    </div>


                                </div>
                                <div className="mx-2 md:mx-6 flex-1 md:flex" >
                                    <p className="text-white/80 text-sm">
                                        La Escuela Secundaria Técnica No. 118 forma parte del Sistema Educativo Nacional y opera bajo los lineamientos del Instituto Estatal de Educación Pública de Oaxaca (IEEPO).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Línea divisoria y copyright */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © 2026 Secundaria Técnica No. 118. Todos los derechos reservados.
                            <span className="block md:inline md:ml-2 text-yellow-400 font-semibold">CCT: 09DST0118V</span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Aviso de Privacidad
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Reglamento
                            </a>
                            <a href="https://www.gob.mx/sep" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                                SEP
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
