"use client";
import React from 'react';
import { boletas, type Boleta } from '@/lib/data/mockData';

export default function BoletasSection() {
    const getCalificacionColor = (calificacion: number) => {
        if (calificacion >= 9) return 'text-green-600 bg-green-50';
        if (calificacion >= 8) return 'text-blue-600 bg-blue-50';
        if (calificacion >= 7) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getPromedioColor = (promedio: number) => {
        if (promedio >= 9) return 'from-green-500 to-emerald-600';
        if (promedio >= 8) return 'from-blue-500 to-indigo-600';
        if (promedio >= 7) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-rose-600';
    };

    return (
        <section id="boletas" className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
                        <span className="text-3xl">📝</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Boletas y Calificaciones
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Consulta tus calificaciones y boletas de evaluación
                    </p>
                </div>

                {/* Boletas Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {boletas.map((boleta) => (
                        <div
                            key={boleta.id}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                        >
                            {/* Header Card */}
                            <div className={`p-6 bg-gradient-to-r ${getPromedioColor(boleta.promedio)} text-white`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">
                                            {boleta.nombreEstudiante}
                                        </h3>
                                        <p className="text-white/90 text-sm">
                                            {boleta.grado}° Grado - Grupo {boleta.grupo}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">
                                            {boleta.promedio.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-white/90">Promedio</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/90">
                                    <span>{boleta.periodo}</span>
                                    <span>•</span>
                                    <span>{boleta.cicloEscolar}</span>
                                </div>
                            </div>

                            {/* Calificaciones Table */}
                            <div className="p-6">
                                <div className="space-y-3">
                                    {boleta.calificaciones.map((cal, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    {cal.materia}
                                                </h4>
                                                {cal.faltas > 0 && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        {cal.faltas} {cal.faltas === 1 ? 'falta' : 'faltas'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getCalificacionColor(cal.calificacion)}`}>
                                                {cal.calificacion.toFixed(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                        <span>Fecha de emisión:</span>
                                        <span className="font-medium">{boleta.fechaEmision}</span>
                                    </div>
                                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar Boleta PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">Información Importante</h3>
                            <p className="text-gray-700 text-sm">
                                Las boletas están disponibles al finalizar cada bimestre. Si encuentras algún error en tus calificaciones,
                                acude con tu profesor de la materia correspondiente dentro de los primeros 5 días hábiles posteriores a la publicación.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
