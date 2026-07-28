"use client";
import { motion } from "framer-motion";

export default function UbicacionSection() {
    const mapsUrl = "https://maps.app.goo.gl/K1ca1DwxrsoBiZLL6";

    return (
        <section id="ubicacion" className="min-h-screen bg-surface-dark py-20 relative overflow-hidden">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-merriweather">
                        ¿Dónde <span className="text-yellow-400">Nos Ubicamos?</span>
                    </h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Visítanos en nuestras instalaciones. Estamos ubicados en el corazón de Oaxaca.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Información de contacto */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Dirección</h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            Río Tehuantepec 300, Fraccionamiento los Ríos<br />
                                            Oaxaca de Juárez, 68020, Oaxaca, México
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Teléfono</h4>
                                        <a href="tel:+529515134204" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                            951 513 4204
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Correo Electrónico</h4>
                                        <a href="mailto:est.118.oax@gmail.com" className="text-gray-300 hover:text-yellow-400 transition-colors">
                                            est.118.oax@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Horario de Atención</h4>
                                        <p className="text-gray-300">
                                            Lunes a Viernes: 7:00 AM - 3:00 PM<br />
                                            Área de Contraloría: 7:15 AM - 9:30 AM y 10:00 AM - 1:30 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg"
                        >
                            Abrir en Google Maps →
                        </motion.a>
                    </motion.div>

                    {/* Mapa */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <iframe
                            /*src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2346.370876886765!2d-96.70160691843421!3d17.08322606249327!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c723d5e7803005%3A0xb366df0e04bf4c44!2sEscuela%20Secundaria%20T%C3%A9cnica%20118!5e1!3m2!1ses-419!2smx!4v1768110829182!5m2!1ses-419!2smx"
                            */
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3813.7889666998717!2d-96.70160691843422!3d17.082972239450402!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c723d5e7803005%3A0xb366df0e04bf4c44!2sEscuela%20Secundaria%20T%C3%A9cnica%20118!5e0!3m2!1ses-419!2smx!4v1768110965268!5m2!1ses-419!2smx"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-2xl"
                        />
                        <div className="absolute inset-0 pointer-events-none border-2 border-yellow-400/50 rounded-2xl" />
                    </motion.div>

                </div>

                {/* Información adicional */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <p className="text-3xl font-bold text-yellow-400 mb-2">CCT</p>
                        <p className="text-white font-semibold">09DST0118V</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <p className="text-3xl font-bold text-yellow-400 mb-2">IEEPO</p>
                        <p className="text-white font-semibold">Instituto Estatal de Educación Pública de Oaxaca</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <p className="text-3xl font-bold text-yellow-400 mb-2">Desde</p>
                        <p className="text-white font-semibold">1984</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}


