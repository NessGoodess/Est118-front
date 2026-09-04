"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { galleryItems } from "@/lib/data/mockData";
import Image from "next/image";

// Map ratio string to Tailwind aspect class
const RATIO_CLASS: Record<string, string> = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "16/9": "aspect-video",
};

const categories = ["Todos", ...Array.from(new Set(galleryItems.map(item => item.category)))];

export default function GaleriaPage() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredItems = selectedCategory === "Todos"
        ? galleryItems
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-muted via-surface-elevated to-surface-muted">
            {/* Hero header */}
            <section className="public-hero-offset relative bg-linear-to-r from-brand-900 via-brand-700 to-brand-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-brand-900/90 to-brand-700/70" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-48 md:min-h-56 flex items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-public-on-media"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
                            Visual Gallery
                        </h1>
                        <p className="text-xl md:text-2xl text-public-on-media/90 max-w-3xl">
                            Outstanding moments from our school community
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category filters */}
            <section className="sticky top-[var(--public-header-h-compact)] z-40 bg-surface-elevated/95 backdrop-blur-md shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === category
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-surface-muted text-foreground hover:bg-surface-muted"
                                    }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Masonry gallery — CSS columns; each card adopts its own ratio */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        /*
                          columns-1 → columns-2 → columns-3:
                          CSS columns breaks the flow so taller items (portrait ratio)
                          naturally stack without distorting shorter ones (landscape/square).
                          `break-inside-avoid` prevents a single card from being split.
                        */
                        className="columns-1 gap-4 sm:columns-2 lg:columns-3"
                    >
                        {filteredItems.map((item, index) => {
                            const ratioClass = RATIO_CLASS[item.ratio ?? "4/3"];
                            return (
                                <motion.div
                                    key={`${item.id}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.35, delay: index * 0.04 }}
                                    className="break-inside-avoid mb-4"
                                >
                                    <Link href={`/galeria/${item.id}`} scroll={false}>
                                        {/*
                      The card height is driven entirely by the ratio class.
                      Hover reveals a gradient + title + description overlay.
                    */}
                                        <div className={`group relative w-full overflow-hidden rounded-2xl shadow-md
                                     hover:shadow-2xl transition-shadow duration-300 ${ratioClass}`}>
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />

                                            {/* Gradient overlay — appears on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40
                                      to-transparent opacity-0 group-hover:opacity-100
                                      transition-opacity duration-300" />

                                            {/* Info panel — slides up on hover */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-4
                                      translate-y-3 opacity-0
                                      group-hover:translate-y-0 group-hover:opacity-100
                                      transition-all duration-300">
                                                {/* Category pill */}
                                                <span className="mb-2 w-fit rounded-full bg-accent-gold px-2.5 py-0.5
                                         text-[11px] font-bold uppercase text-foreground">
                                                    {item.category}
                                                </span>
                                                <h3 className="text-public-on-media text-base font-bold leading-snug line-clamp-2 mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-public-on-media/85 text-xs leading-relaxed line-clamp-3 mb-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between text-public-on-media-muted text-[11px]">
                                                    <span>{item.date}</span>
                                                    {item.author && <span className="truncate ml-2">{item.author}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-fg-muted text-lg">No items in this category.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
