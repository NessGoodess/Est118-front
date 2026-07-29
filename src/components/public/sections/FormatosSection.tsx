"use client";
import React, { useState } from 'react';
import { formatos, type Formato } from '@/lib/data/mockData';

export default function FormatosSection() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const categories = ['Todos', 'Académico', 'Administrativo', 'Justificante', 'Solicitud'];

    const filteredFormatos = selectedCategory === 'Todos'
        ? formatos
        : formatos.filter(f => f.categoria === selectedCategory);

    const getCategoryColor = (categoria: Formato['categoria']) => {
        const colors = {
            'Académico': 'from-brand-500 to-brand-700',
            'Administrativo': 'from-info to-accent',
            'Justificante': 'from-warning to-accent-gold',
            'Solicitud': 'from-success to-accent'
        };
        return colors[categoria];
    };

    return (
        <section id="formatos" className="py-16 lg:py-24 bg-surface-app">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-warning rounded-2xl mb-4">
                        <span className="text-3xl">📥</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Descarga de Formatos
                    </h2>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Formatos y documentos oficiales disponibles para descarga
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-warning text-warning-foreground shadow-lg shadow-warning/30'
                                    : 'bg-surface-elevated text-foreground hover:bg-surface-muted border border-border'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Formatos Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFormatos.map((formato) => (
                        <div
                            key={formato.id}
                            className="bg-surface-elevated rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-border"
                        >
                            {/* Icon Header */}
                            <div className={`p-6 bg-gradient-to-r ${getCategoryColor(formato.categoria)} text-white`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-5xl">{formato.icono}</span>
                                    <span className="px-3 py-1 bg-surface-elevated/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                        {formato.categoria}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold">
                                    {formato.nombre}
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-sm text-fg-muted mb-4">
                                    {formato.descripcion}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-surface-muted rounded-lg p-3">
                                        <div className="text-xs text-fg-muted mb-1">Tamaño</div>
                                        <div className="font-bold text-foreground">{formato.tamano}</div>
                                    </div>
                                    <div className="bg-surface-muted rounded-lg p-3">
                                        <div className="text-xs text-fg-muted mb-1">Descargas</div>
                                        <div className="font-bold text-foreground">{formato.descargas.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Update Date */}
                                <div className="flex items-center gap-2 text-xs text-fg-muted mb-4">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Actualizado: {formato.fechaActualizacion}
                                </div>

                                {/* Download Button */}
                                <button className={`w-full py-3 bg-gradient-to-r ${getCategoryColor(formato.categoria)} text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg group-hover:scale-105`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFormatos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-fg-muted">No hay formatos en esta categoría</p>
                    </div>
                )}

                {/* Help Box */}
                <div className="mt-12 bg-warning/10 border border-warning/30 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground mb-2">¿Necesitas ayuda?</h3>
                            <p className="text-foreground text-sm mb-3">
                                Si tienes dudas sobre cómo llenar algún formato o necesitas asistencia,
                                acude al área de servicios escolares de lunes a viernes de 8:00 AM a 2:00 PM.
                            </p>
                            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2">
                                Contactar Servicios Escolares
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
