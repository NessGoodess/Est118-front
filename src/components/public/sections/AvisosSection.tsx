"use client";
import React, { useState } from 'react';
import { avisos, type Aviso } from '@/lib/data/mockData';

export default function AvisosSection() {
    const [selectedGrado, setSelectedGrado] = useState<string>('Todos');
    const [selectedTipo, setSelectedTipo] = useState<string>('Todos');

    const grados = ['Todos', '1', '2', '3'];
    const tipos = ['Todos', 'Informativo', 'Urgente', 'Recordatorio', 'Tarea'];

    const filteredAvisos = avisos.filter(aviso => {
        const matchGrado = selectedGrado === 'Todos' || aviso.grado === selectedGrado;
        const matchTipo = selectedTipo === 'Todos' || aviso.tipo === selectedTipo;
        return matchGrado && matchTipo;
    });

    const getTipoColor = (tipo: Aviso['tipo']) => {
        const colors = {
            'Informativo': 'bg-blue-100 text-blue-700 border-blue-200',
            'Urgente': 'bg-red-100 text-red-700 border-red-200',
            'Recordatorio': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Tarea': 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[tipo];
    };

    const getTipoIcon = (tipo: Aviso['tipo']) => {
        const icons = {
            'Informativo': 'ℹ️',
            'Urgente': '⚠️',
            'Recordatorio': '🔔',
            'Tarea': '📚'
        };
        return icons[tipo];
    };

    return (
        <section id="avisos" className="py-16 lg:py-24 bg-gradient-to-br from-cyan-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-2xl mb-4">
                        <span className="text-3xl">📌</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Avisos por Grupo / Grado
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Avisos, tareas y notificaciones importantes para estudiantes
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Grado Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Filtrar por Grado
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {grados.map((grado) => (
                                    <button
                                        key={grado}
                                        onClick={() => setSelectedGrado(grado)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedGrado === grado
                                            ? 'bg-cyan-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {grado === 'Todos' ? 'Todos' : `${grado}° Grado`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tipo Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                Filtrar por Tipo
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tipos.map((tipo) => (
                                    <button
                                        key={tipo}
                                        onClick={() => setSelectedTipo(tipo)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedTipo === tipo
                                            ? 'bg-cyan-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tipo}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avisos List */}
                <div className="space-y-4">
                    {filteredAvisos.map((aviso) => (
                        <div
                            key={aviso.id}
                            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${aviso.importante ? 'border-red-500' : 'border-cyan-500'
                                } ${!aviso.leido ? 'ring-2 ring-cyan-200' : ''}`}
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="text-4xl flex-shrink-0">
                                            {getTipoIcon(aviso.tipo)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {aviso.titulo}
                                                </h3>
                                                {!aviso.leido && (
                                                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                                                        Nuevo
                                                    </span>
                                                )}
                                                {aviso.importante && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                        ⭐ Importante
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 mb-4">
                                                {aviso.contenido}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {aviso.autor}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {aviso.fecha}
                                        </span>
                                        {aviso.grado && (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                                {aviso.grado}° {aviso.grupo ? `- Grupo ${aviso.grupo}` : 'Grado'}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getTipoColor(aviso.tipo)}`}>
                                        {aviso.tipo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAvisos.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <span className="text-6xl mb-4 block">📭</span>
                        <p className="text-gray-500 text-lg">
                            No hay avisos con los filtros seleccionados
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-3xl font-bold text-cyan-600 mb-1">
                            {avisos.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Avisos</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-3xl font-bold text-red-600 mb-1">
                            {avisos.filter(a => a.importante).length}
                        </div>
                        <div className="text-sm text-gray-600">Importantes</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {avisos.filter(a => a.tipo === 'Tarea').length}
                        </div>
                        <div className="text-sm text-gray-600">Tareas</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                            {avisos.filter(a => !a.leido).length}
                        </div>
                        <div className="text-sm text-gray-600">No Leídos</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
