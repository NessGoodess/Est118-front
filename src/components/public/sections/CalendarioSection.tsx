"use client";
import React, { useState } from 'react';
import { calendarioEscolar, type CalendarioItem } from '@/lib/data/mockData';

export default function CalendarioSection() {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getEventIcon = (tipo: CalendarioItem['tipo']) => {
        const icons = {
            'Vacaciones': '🏖️',
            'Examen': '📝',
            'Evento': '🎉',
            'Suspension': '⚠️',
            'Entrega': '📤',
            'Junta': '👥'
        };
        return icons[tipo];
    };

    const filteredEvents = calendarioEscolar.filter(event => {
        const eventMonth = new Date(event.fecha).getMonth();
        return eventMonth === selectedMonth;
    });

    return (
        <section id="calendario" className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-teal-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
                        <span className="text-3xl">📅</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Calendario Escolar
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Fechas importantes y eventos del ciclo escolar 2025-2026
                    </p>
                </div>

                {/* Month Selector */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex gap-2 min-w-max justify-center pb-2">
                        {months.map((month, idx) => (
                            <button
                                key={month}
                                onClick={() => setSelectedMonth(idx)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${selectedMonth === idx
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Events */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {calendarioEscolar.map((event) => {
                        const eventDate = new Date(event.fecha);
                        const endDate = event.fechaFin ? new Date(event.fechaFin) : null;

                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                                style={{ borderLeftColor: event.color }}
                            >
                                <div className="p-6">
                                    {/* Date Badge */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div
                                            className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: event.color }}
                                        >
                                            <span className="text-2xl">{eventDate.getDate()}</span>
                                            <span className="text-xs uppercase">{months[eventDate.getMonth()].slice(0, 3)}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{getEventIcon(event.tipo)}</span>
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{ backgroundColor: event.color }}
                                                >
                                                    {event.tipo}
                                                </span>
                                            </div>
                                            {event.importante && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    ⭐ Importante
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {event.titulo}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {event.descripcion}
                                    </p>

                                    {/* Duration */}
                                    {endDate && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>
                                                {eventDate.getDate()} - {endDate.getDate()} de {months[eventDate.getMonth()]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500">No hay eventos programados para este mes</p>
                    </div>
                )}

                {/* Download Button */}
                <div className="mt-12 text-center">
                    <button className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar Calendario Completo PDF
                    </button>
                </div>
            </div>
        </section>
    );
}
