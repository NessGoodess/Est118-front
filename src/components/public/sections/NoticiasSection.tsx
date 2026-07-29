"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { newsItems } from "@/lib/data/mockData";
import Image from "next/image";

export default function NoticiasSection() {
    return (
        <section id="noticias" className="min-h-screen bg-gradient-to-b from-surface-muted to-surface-elevated py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-merriweather">
                        Noticias y <span className="text-primary">Avisos</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent-gold mx-auto mb-4" />
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Mantente informado sobre las últimas novedades, eventos y comunicados importantes de nuestra institución.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newsItems.slice(0, 4).map((noticia, index) => (
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

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="https://www.facebook.com/EscSecTecnica118"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 rounded-full font-semibold transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Ver más en Facebook
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}


