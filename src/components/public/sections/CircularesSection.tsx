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
            'General': 'bg-blue-100 text-blue-700 border-blue-200',
            'Académico': 'bg-green-100 text-green-700 border-green-200',
            'Administrativo': 'bg-purple-100 text-purple-700 border-purple-200',
            'Urgente': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[categoria];
    };

    return (
        <section id="circulares" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <span className="text-3xl">📄</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Circulares Oficiales
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                        >
                            {/* Header */}
                            <div className={`p-4 border-b-2 ${circular.importante ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-sm font-bold text-gray-900">
                                            Circular {circular.numero}
                                        </span>
                                        {circular.importante && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
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
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {circular.titulo}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {circular.resumen}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {circular.fecha}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {circular.destinatarios.map((dest, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                                            {dest}
                                        </span>
                                    ))}
                                </div>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
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
                        <p className="text-gray-500">No hay circulares en esta categoría</p>
                    </div>
                )}
            </div>
        </section>
    );
}
