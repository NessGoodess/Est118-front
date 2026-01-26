"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { eventItems } from "@/lib/data/mockData";

export default function EventosSection() {
    return (
        <section id="eventos" className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-merriweather">
                        Próximos <span className="text-blue-600">Eventos</span>
                    </h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Participa en nuestras actividades y eventos académicos, culturales y deportivos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {eventItems.map((evento, index) => (
                        <motion.div
                            key={evento.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 border-blue-600"
                        >
                            <Link href={`/eventos/${evento.id}`} scroll={false}>
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                                {evento.tipo}
                                            </span>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {evento.titulo}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-yellow-400 text-gray-900 rounded-lg p-3 text-center min-w-[80px]">
                                                <p className="text-xs font-semibold uppercase">Fecha</p>
                                                <p className="text-lg font-bold">{evento.fecha.split(' ')[0]}</p>
                                                <p className="text-xs">{evento.fecha.split(' ').slice(1).join(' ')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {evento.descripcion}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Hora</p>
                                                <p className="text-sm font-semibold text-gray-900">{evento.hora}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Lugar</p>
                                                <p className="text-sm font-semibold text-gray-900">{evento.lugar}</p>
                                            </div>
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
                    className="text-center mt-12"
                >
                    <Link href="/eventos">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg"
                        >
                            Ver Calendario Completo
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}


