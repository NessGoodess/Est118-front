"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    status: 'active' | 'inactive' | 'draft';
    position: number;
}

interface FeaturesData {
    title: string;
    subtitle?: string;
    image: string;
    imageAlt: string;
    layout: 'left' | 'right'; // Imagen a la izquierda o derecha
    features: Feature[];
    status: 'active' | 'inactive';
}

// ============================================================================
// API SERVICE (Simulado)
// ============================================================================

const featuresService = {
    async getFeaturesSection(): Promise<FeaturesData> {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            title: "PROTECCIÓN SUPERIOR ANTI-FRAUDE",
            subtitle: "Tecnología de punta para tu seguridad",
            image: "/images/woman-phone.jpg", // Cambia por tu ruta
            imageAlt: "Mujer usando aplicación móvil segura",
            layout: "left",
            status: "active",
            features: [
                {
                    id: 1,
                    title: "Cobertura total",
                    description: "Detén el fraude en todas sus formas: desde deepfakes hasta documentos manipulados, por medio de ataques de presentación o de inyección.",
                    icon: "shield",
                    status: "active",
                    position: 1
                },
                {
                    id: 2,
                    title: "Preparados para las nuevas amenazas",
                    description: "Innovamos constantemente para adaptarnos al ritmo de los nuevos ataques y de los cambios normativos, con un roadmap vivo y flexible.",
                    icon: "lightbulb",
                    status: "active",
                    position: 2
                },
                {
                    id: 3,
                    title: "Verifica a la primera, desde cualquier lugar",
                    description: "Verificación de identidad segura en todos los canales: redes sociales, aplicaciones móviles o procesos presenciales, para una validación fluida en segundos.",
                    icon: "user-check",
                    status: "active",
                    position: 3
                },
                {
                    id: 4,
                    title: "Crecimiento basado en la confianza",
                    description: "Una identidad segura impulsa el crecimiento: más clientes, más transacciones y más valor a largo plazo.",
                    icon: "chart",
                    status: "active",
                    position: 4
                },
                {
                    id: 5,
                    title: "Característica Inactiva",
                    description: "Esta característica no se mostrará porque está inactiva.",
                    icon: "lock",
                    status: "inactive",
                    position: 5
                }
            ]
        };
    }
};

// ============================================================================
// COMPONENTE: ICON
// ============================================================================

const FeatureIcon = ({ type }: { type: string }) => {
    const icons: Record<string, React.ReactNode> = {
        shield: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        lightbulb: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        'user-check': (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        chart: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        lock: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    };

    return icons[type] || icons.shield;
};

// ============================================================================
// COMPONENTE: FEATURE ITEM
// ============================================================================

const FeatureItem = ({ feature }: { feature: Feature }) => {
    return (
        <div className="flex items-start gap-4 group">
            {/* Icono */}
            <div className="flex-shrink-0 w-16 h-16 bg-[#0a1f44] rounded-2xl flex items-center justify-center text-white group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <FeatureIcon type={feature.icon} />
            </div>

            {/* Contenido */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// COMPONENTE: DECORATIVE IMAGE
// ============================================================================

const DecorativeImage = ({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }) => {
    return (
        <div className="relative">
            {/* Imagen principal */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                />

                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            </div>

            {/* Decoración de fondo - Barra azul */}
            <div className="absolute -top-8 -left-12 w-32 h-[120%] bg-[#0a1f44] rounded-3xl -z-10 transform -rotate-12" />

            {/* Decoración de fondo - Barra coral */}
            <div className="absolute -top-8 -right-12 w-32 h-[120%] bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl -z-10 transform rotate-12" />

            {/* Puntos decorativos */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60 -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60 -z-10" />
        </div>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL: FEATURES SECTION
// ============================================================================

export default function FeaturesSection() {
    const [data, setData] = useState<FeaturesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await featuresService.getFeaturesSection();
                setData(result);
            } catch (error) {
                console.error('Error al cargar características:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-10 bg-slate-200 rounded w-2/3 mb-4"></div>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-96 bg-slate-200 rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // No mostrar si el status es inactivo
    if (!data || data.status === 'inactive') {
        return null;
    }

    // Filtrar y ordenar características activas por posición
    const activeFeatures = data.features
        .filter(f => f.status === 'active')
        .sort((a, b) => a.position - b.position);

    return (
        <section className="py-20 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                        {data.title}
                    </h2>
                    {data.subtitle && (
                        <p className="text-xl text-slate-600">
                            {data.subtitle}
                        </p>
                    )}
                </div>

                {/* Grid principal */}
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${data.layout === 'right' ? 'lg:grid-flow-dense' : ''
                    }`}>

                    {/* Columna de características */}
                    <div className="space-y-8">
                        {activeFeatures.map((feature) => (
                            <FeatureItem key={feature.id} feature={feature} />
                        ))}
                    </div>

                    {/* Columna de imagen */}
                    <div className={data.layout === 'right' ? 'lg:col-start-2' : ''}>
                        <DecorativeImage
                            imageSrc={data.image}
                            imageAlt={data.imageAlt}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// EJEMPLO DE USO EN UNA PÁGINA
// ============================================================================

export function ExamplePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Otras secciones */}
            <div className="h-20 bg-slate-900" />

            {/* Features Section */}
            <FeaturesSection />

            {/* Otras secciones */}
            <div className="h-20 bg-slate-900" />
        </div>
    );
}