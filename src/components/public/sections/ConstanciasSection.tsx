"use client";
import React, { useState } from 'react';
import { constancias, type Constancia } from '@/lib/data/mockData';

export default function ConstanciasSection() {
    const [selectedConstancia, setSelectedConstancia] = useState<Constancia | null>(null);

    const getTypeIcon = (tipo: Constancia['tipo']) => {
        const icons = {
            'Estudios': '📚',
            'Conducta': '⭐',
            'Calificaciones': '📊',
            'Inscripción': '✅'
        };
        return icons[tipo];
    };

    const getTypeColor = (tipo: Constancia['tipo']) => {
        const colors = {
            'Estudios': 'from-blue-500 to-cyan-600',
            'Conducta': 'from-green-500 to-emerald-600',
            'Calificaciones': 'from-purple-500 to-pink-600',
            'Inscripción': 'from-orange-500 to-red-600'
        };
        return colors[tipo];
    };

    return (
        <section id="constancias" className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
                        <span className="text-3xl">🧾</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Constancias
                    </h2>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Solicita constancias oficiales de la institución
                    </p>
                </div>

                {/* Constancias Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {constancias.map((constancia) => (
                        <button
                            key={constancia.id}
                            onClick={() => setSelectedConstancia(constancia)}
                            className={`bg-surface-elevated rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${selectedConstancia?.id === constancia.id
                                    ? 'border-purple-600 ring-4 ring-purple-100'
                                    : 'border-transparent hover:border-purple-200'
                                }`}
                        >
                            <div className={`p-6 bg-gradient-to-r ${getTypeColor(constancia.tipo)} text-white`}>
                                <div className="text-5xl mb-3">{getTypeIcon(constancia.tipo)}</div>
                                <h3 className="text-xl font-bold">
                                    Constancia de {constancia.tipo}
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-fg-muted">Tiempo de entrega:</span>
                                    <span className="font-bold text-foreground">{constancia.tiempoEntrega}</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-border">
                                    <span className={`font-bold ${constancia.costo === 'Gratuito' ? 'text-success' : 'text-purple-600'}`}>
                                        {constancia.costo}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detailed View */}
                {selectedConstancia && (
                    <div className="bg-surface-elevated rounded-2xl shadow-2xl overflow-hidden border border-border">
                        <div className={`p-8 bg-gradient-to-r ${getTypeColor(selectedConstancia.tipo)} text-white`}>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-6xl">{getTypeIcon(selectedConstancia.tipo)}</span>
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">
                                        Constancia de {selectedConstancia.tipo}
                                    </h3>
                                    <p className="text-white/90">
                                        {selectedConstancia.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Requisitos */}
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Requisitos
                                    </h4>
                                    <ul className="space-y-3">
                                        {selectedConstancia.requisitos.map((req, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-foreground">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Documentos Necesarios */}
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Documentos Necesarios
                                    </h4>
                                    <ul className="space-y-3">
                                        {selectedConstancia.documentosNecesarios.map((doc, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-foreground">{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid md:grid-cols-2 gap-4 mt-8">
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <div className="text-sm text-fg-muted">Tiempo de entrega</div>
                                            <div className="font-bold text-foreground">{selectedConstancia.tiempoEntrega}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <div className="text-sm text-fg-muted">Costo</div>
                                            <div className="font-bold text-foreground">{selectedConstancia.costo}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-8">
                                <button className={`w-full py-4 bg-gradient-to-r ${getTypeColor(selectedConstancia.tipo)} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Solicitar Constancia de {selectedConstancia.tipo}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!selectedConstancia && (
                    <div className="text-center py-12 bg-surface-elevated rounded-2xl border-2 border-dashed border-border">
                        <span className="text-6xl mb-4 block">👆</span>
                        <p className="text-fg-muted text-lg">
                            Selecciona un tipo de constancia para ver más detalles
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
