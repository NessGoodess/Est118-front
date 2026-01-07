import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer id="contacto" className=" text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* School Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 relative">
                                <Image
                                    src="/logo_primary.png"
                                    alt="Logo Escuela Secundaria Técnica 118"
                                    className="w-full h-full object-contain"
                                    width={96}
                                    height={96}
                                    loading="eager"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-gray-400/70 text-sm font-medium">IEEPO</span>
                                    <span className="text-xs px-2 py-1 rounded bg-gradient-to-r from-[#181d49] to-[#2d469b] text-white/80">Estado de Oaxaca</span>
                                </div>
                                <span className="text-2xl font-bold text-white">Secundaria Técnica No. 118</span>
                                <p className="text-gray-300 text-sm">
                                    "Forjando el Futuro con Tecnología y Valores"
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Institución educativa comprometida con la excelencia académica y la formación técnica integral de nuestros estudiantes desde 1984.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <span className="text-white" role="img" aria-label="Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg"  className="w-full h-auto" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                                <span className="text-white" role="img" aria-label="Instagram">📷</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                                <span className="text-white" role="img" aria-label="YouTube">📺</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-amber-300">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
                            </li>
                            <li>


                                <Link href={"/login"}>
                                    <button className="text-gray-300 hover:text-white transition-colors">Portal Administrativo
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <a href="#talleres" className="text-gray-300 hover:text-white transition-colors">Talleres Técnicos</a>
                            </li>
                            <li>
                                <a href="#nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">Inscripciones</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">Calendario Escolar</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-amber-300">Contacto</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
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
                            </li>
                            <li className="flex items-center space-x-2">
                                <span role="img" aria-label="Teléfono">📞</span>
                                <span className="text-gray-300">951-513-4204</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span role="img" aria-label="Dirección">📍</span>
                                <span className="text-gray-300">Rio Tehuantepec 300, Fraccionamiento los Ríos
                                    Oaxaca de Juárez, 68020, MX</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span role="img" aria-label="Horario">🕒</span>
                                <span className="text-gray-300">Lun-Vie 7:00-15:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 Secundaria Técnica No. 118. Todos los derechos reservados.{" "}
                            <span className="text-amber-300">CCT: 09DST0118V</span>
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Aviso de Privacidad</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Reglamento</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">SEP</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}