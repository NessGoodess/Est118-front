"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { galleryItems } from "@/lib/data/mockData";

export default function GaleriaSection() {
    const featuredItems = galleryItems.slice(0, 6);

    return (
        <section id="galeria" className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
                        Galería <span className="text-blue-600">Visual</span>
                    </h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Descubre los momentos más destacados de nuestra comunidad educativa a través de nuestra galería visual.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <Link href={`/galeria/${item.id}`}>
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Overlay con información */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                                {item.category}
                                            </span>
                                            <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-sm line-clamp-2 mb-2">
                                                {item.description}
                                            </p>
                                            <p className="text-white/70 text-xs">
                                                {item.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                >
                    <Link href="/galeria">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg"
                        >
                            Ver Galería Completa
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

