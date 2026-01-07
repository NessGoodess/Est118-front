"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        image: "/Banner1.png",
        title: "",
        description: "",
    },
    {
        image: "/Banner2.png",
        title: "Tecnología Avanzada",
        description: "Laboratorios de computación y programación modernos",
    },
    {
        image: "/Banner1.png",
        title: "",
        description: "",
    },
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 5000);
        return () => clearInterval(interval);
    }, [total]);

    const handlePrev = () => setCurrent((prev) => (prev - 1 + total) % total);
    const handleNext = () => setCurrent((prev) => (prev + 1) % total);

    return (
        <section className="py-16 bg-transparent h-screen">
            <div className=" px-6 mx-10 my-10 rounded-2xl bg-white shadow-2xl shadow-black/10">

                <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                backgroundImage: `url(${slides[current].image || '/default-school.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            className={`absolute inset-0 flex items-center justify-center `}
                        >
                            <div className="text-center text-white">
                                <h3 className="text-3xl font-bold mb-2">
                                    {slides[current].title}
                                </h3>
                                <p className="text-lg">{slides[current].description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all z-10 cursor-pointer"
                        onClick={handlePrev}
                        aria-label="Anterior"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all z-10 cursor-pointer"
                        onClick={handleNext}
                        aria-label="Siguiente"
                    >
                        <i className="fa-solid fa-arrow-right"></i>
                        <i className="fas fa-chevron-right text-gray-800"></i>
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-3 h-3 rounded-full transition-all hover:bg-grey-300 transform duration-300 hover:scale-150  cursor-pointer ${current === idx
                                        ? "bg-blue-600 bg-opacity-100"
                                        : "bg-white bg-opacity-60 hover:bg-grey-300"
                                    }`}
                                onClick={() => setCurrent(idx)}
                                aria-label={`Ir al slide ${idx + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>


            </div>
        </section>
    );
}
