"use client";
import React, { useState } from 'react';
import { circulares, type Circular } from '@/lib/data/mockData';

export default function CircularesSection() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const categories = ['Todas', 'General', 'Académico', 'Administrativo', 'Urgente'];

    const filteredCirculares = selectedCategory === 'Todas'
        ? circulares
        : circulares.filter(c => c.categoria === selectedCategory);

    const getCategoryColor = (categoria: Circular['categoria']) => {
        const colors = {
            'General': 'bg-primary-soft text-primary border-border',
            'Académico': 'bg-success/10 text-success border-success/30',
            'Administrativo': 'bg-info/10 text-info border-info/30',
            'Urgente': 'bg-danger/10 text-danger border-danger/30'
        };
        return colors[categoria];
    };

    return (
        <section id="circulares" className="py-16 lg:py-24 bg-gradient-to-br from-surface-muted to-primary-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <span className="text-3xl">📄</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Circulares Oficiales
                    </h2>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Comunicados oficiales y avisos importantes de la institución
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                    : 'bg-surface-elevated text-foreground hover:bg-surface-muted border border-border'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Circulares Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCirculares.map((circular) => (
                        <div
                            key={circular.id}
                            className="bg-surface-elevated rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-border"
                        >
                            {/* Header */}
                            <div className={`p-4 border-b-2 ${circular.importante ? 'bg-danger/10 border-danger/30' : 'bg-surface-muted border-border'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-sm font-bold text-foreground">
                                            Circular {circular.numero}
                                        </span>
                                        {circular.importante && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">
                                                ⚠️ Importante
                                            </span>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(circular.categoria)}`}>
                                        {circular.categoria}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {circular.titulo}
                                </h3>
                                <p className="text-sm text-fg-muted mb-4">
                                    {circular.resumen}
                                </p>
                                <div className="flex items-center justify-between text-xs text-fg-muted mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {circular.fecha}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {circular.destinatarios.map((dest, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-primary-soft text-primary text-xs rounded-lg">
                                            {dest}
                                        </span>
                                    ))}
                                </div>
                                <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCirculares.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-fg-muted">No hay circulares en esta categoría</p>
                    </div>
                )}
            </div>
        </section>
    );
}
