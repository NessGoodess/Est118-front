"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroWelcome() {
    return (
        <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background con gradiente */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500"
                style={{
                    backgroundImage: `url("/background4.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "overlay",
                    opacity: 0.3,
                }}
            />
            
            {/* Overlay adicional para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Contenido principal */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Texto */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-white"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 relative">
                                <Image
                                    src="/logo.PNG"
                                    alt="Logo Escuela Secundaria Técnica 118"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            <div className="border-l-4 border-yellow-400 pl-4">
                                <p className="text-sm md:text-base text-yellow-300 font-semibold">IEEPO</p>
                                <p className="text-xs text-white/80">Estado de Oaxaca</p>
                            </div>
                        </motion.div>

                        <motion.h1 
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-merriweather leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
                        >
                            Escuela Secundaria <br />
                            <span className="text-yellow-300">Técnica No. 118</span>
                        </motion.h1>

                        <motion.p 
                            className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
                        >
                            Somos una Institución siempre preocupada por la preparación de sus estudiantes 
                            y su visión al futuro. Institución educativa fundada desde 1984 con el objetivo 
                            de dar educación a la población conurbada del centro de la Ciudad de Oaxaca.
                        </motion.p>

                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <Link href="/inscripciones">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-primary px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                                >
                                    Preinscripciones 2026
                                </motion.button>
                            </Link>
                            <motion.a
                                href="#noticias"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white text-white hover:bg-surface-elevated hover:text-primary px-8 py-4 rounded-full font-semibold text-lg transition-all inline-block text-center"
                            >
                                Conoce Más
                            </motion.a>
                        </motion.div>

                        {/* Información adicional */}
                        <motion.div
                            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="bg-surface-elevated/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-3xl font-bold text-yellow-300">40+</p>
                                <p className="text-sm text-white/80">Años de experiencia</p>
                            </div>
                            <div className="bg-surface-elevated/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-3xl font-bold text-yellow-300">4</p>
                                <p className="text-sm text-white/80">Talleres técnicos</p>
                            </div>
                            <div className="bg-surface-elevated/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-3xl font-bold text-yellow-300">100%</p>
                                <p className="text-sm text-white/80">Educación pública</p>
                            </div>
                            <div className="bg-surface-elevated/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <p className="text-3xl font-bold text-yellow-300">CCT</p>
                                <p className="text-sm text-white/80">09DST0118V</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Imagen */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/background1.png"
                                alt="Escuela Secundaria Técnica 118"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
                        </div>
                        {/* Decoración */}
                        <motion.div
                            className="absolute -bottom-8 -right-8 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </section>
    );
}
