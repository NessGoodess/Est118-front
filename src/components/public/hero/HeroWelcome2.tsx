"use client";
import { motion } from "framer-motion";
import { useScroll } from "@/contexts/ScrollProvider";

export default function HeroWelcome() {
    const { scrolled, visible } = useScroll();
    return (
        <section
            id="inicio"
            className="hero-background h-screen flex items-center relative"
            style={{
                backgroundImage: `url(${scrolled ? "/background5.png" : "/background4.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "scroll",
                backgroundBlendMode: "multiply",
                backgroundColor: "rgba(36, 53, 146, 0.56)",
            }}>
            <div className={`absolute inset-0 transition-all duration-500 pointer-events-none`}>
                {/*
                style={{
                    backdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
                    WebkitBackdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
                }}
            >
            */}
                {/*<div className={`absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent transition-opacity duration-800 ease-out */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent transition-opacity duration-800 ease-out 
                                ${scrolled ? "opacity-800" : "opacity-0"}`}>
                </div>
            </div>
            <motion.div
                className="relative z-10 text-white px-6 font-montserrat left-30 top-20"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <div className={`absolute inset-0 transition-all duration-500 pointer-events-none`}
                    style={{
                        backdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
                        WebkitBackdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
                    }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-montserrat text-[90px] leading-[108px] tracking-[-2.7px] " style={{ textShadow: "4px -2px 6px black" }}>
                        Escuela Secundaria <br /> <span className="text-blue-100">Técnica No. 118</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed justify-left" style={{ textShadow: "4px -2px 6px black" }}>
                        Somos una Institución siempre preocupada por las preparación de sus estudiantes y su visión al futuro. <br />
                        Institución educativa fundada desde 1984 con el objetivo de dar educación a la población conurbada del centro de la Ciudad de Oaxaca.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover-lift">
                            Conoce Más
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-all">
                            Inscripciones
                        </button>
                    </div>

                </div>
            </motion.div>
        </section >
    );
}