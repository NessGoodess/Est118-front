"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { galleryItems, GalleryItem } from "@/lib/data/mockData";

const categories = ["Todos", ...Array.from(new Set(galleryItems.map(item => item.category)))];

export default function GaleriaPage() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const filteredItems = selectedCategory === "Todos" 
        ? galleryItems 
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Header */}
            <section className="relative h-64 md:h-80 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-700/70" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
                            Galería Visual
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
                            Momentos destacados de nuestra comunidad educativa
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filtros */}
            <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Galería */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onHoverStart={() => setHoveredItem(item.id)}
                                onHoverEnd={() => setHoveredItem(null)}
                                className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                <Link href={`/galeria/${item.id}`} scroll={false}>
                                    <div className="relative w-full h-full">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        
                                        {/* Overlay gradiente */}
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                                            hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                                        }`} />

                                        {/* Información en hover */}
                                        <div className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 ${
                                            hoveredItem === item.id 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-4'
                                        }`}>
                                            <span className="inline-block bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold mb-2 w-fit">
                                                {item.category}
                                            </span>
                                            <h3 className="text-white text-lg font-bold mb-1 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-xs line-clamp-2 mb-2">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between text-white/70 text-xs">
                                                <span>{item.date}</span>
                                                {item.author && (
                                                    <span className="truncate ml-2">{item.author}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badge de categoría siempre visible */}
                                        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No hay elementos en esta categoría.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

