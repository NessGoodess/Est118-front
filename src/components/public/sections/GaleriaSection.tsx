"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { galleryItems } from "@/lib/data/mockData";
import Image from "next/image";

const RATIO_CLASS: Record<string, string> = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "16/9": "aspect-video",
};

export default function GaleriaSection() {
    const featuredItems = galleryItems.slice(0, 6);

    return (
        <section id="galeria" className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
                        Visual <span className="text-blue-600">Gallery</span>
                    </h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the most memorable moments of our school community.
                    </p>
                </motion.div>

                {/* Masonry preview — 3 columns, items adapt to their ratio */}
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 mb-12">
                    {featuredItems.map((item, index) => {
                        const ratioClass = RATIO_CLASS[item.ratio ?? "4/3"];
                        return (
                            <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="break-inside-avoid mb-4"
                            >
                                <Link href={`/galeria/${item.id}`}>
                                    <div className={`group relative w-full overflow-hidden rounded-2xl shadow-lg
                                   hover:shadow-2xl transition-shadow duration-300 ${ratioClass}`}>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-5
                                    opacity-0 translate-y-3
                                    group-hover:opacity-100 group-hover:translate-y-0
                                    transition-all duration-300">
                                            <span className="mb-2 w-fit rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-bold text-gray-900">
                                                {item.category}
                                            </span>
                                            <h3 className="text-white text-base font-bold line-clamp-2 mb-1">{item.title}</h3>
                                            <p className="text-white/85 text-xs line-clamp-2">{item.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
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
                            View Full Gallery
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
