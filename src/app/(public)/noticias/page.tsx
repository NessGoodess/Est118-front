"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { newsItems } from "@/lib/data/mockData";
import Image from "next/image";

export default function NoticiasPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-muted to-surface-elevated">
            {/* Header */}
            <section className="relative h-64 md:h-80 bg-gradient-to-r from-brand-900 via-brand-700 to-brand-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-brand-700/70" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-merriweather">
                            Noticias y Avisos
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
                            Mantente informado sobre las últimas novedades de nuestra institución
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Noticias */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsItems.map((noticia, index) => (
                        <motion.div
                            key={noticia.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-surface-elevated rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                            <Link href={`/noticias/${noticia.id}`} scroll={false}>
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={noticia.imagen}
                                        alt={noticia.titulo}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                            {noticia.categoria}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-fg-muted mb-2">{noticia.fecha}</p>
                                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                                        {noticia.titulo}
                                    </h3>
                                    <p className="text-fg-muted text-sm mb-4 line-clamp-3">
                                        {noticia.resumen}
                                    </p>
                                    <span className="text-primary font-semibold text-sm hover:text-primary-hover transition-colors">
                                        Leer más →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

