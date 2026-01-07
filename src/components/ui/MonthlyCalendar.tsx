"use client";

import React, { useState, FC } from "react";
import { MarkedDates } from "@/lib/types/attendance";

type CalendarEvent = {
    date: string;
    title: string;
};

interface CalendarProps {
    events?: CalendarEvent[];
    markedDates?: MarkedDates;
    onDateClick?: (date: string) => void;
}

const MonthlyCalendar: FC<CalendarProps> = ({ events = [], markedDates, onDateClick }) => {
    const today: Date = new Date();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth();

    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    const firstDay: number = new Date(year, month, 1).getDay();

    const monthNames: string[] = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handlePrevMonth = (): void => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = (): void => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="bg-white text-black w-full max-w-lg mx-auto border rounded-lg shadow p-4">
            {/* Header con flechas */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="px-2">⬅️</button>
                <h2 className="text-lg font-bold">
                    {monthNames[month]} {year}
                </h2>
                <button onClick={handleNextMonth} className="px-2">➡️</button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 text-center font-semibold">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d: string) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Celdas del calendario */}
            <div className="grid grid-cols-7 text-center">
                {/* Espacios vacíos antes del día 1 */}
                {Array.from({ length: firstDay }).map((_, i: number) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Días del mes */}
                {Array.from({ length: daysInMonth }, (_, i: number) => {
                    const day: number = i + 1;
                    const isToday: boolean =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                    // Formatear fecha para comparar con markedDates
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isCompleted = markedDates?.completedDates?.includes(dateString);
                    const isIncomplete = markedDates?.incompleteDates?.includes(dateString);

                    return (
                        <div
                            key={day}
                            className={`p-2 m-1 rounded-full cursor-pointer transition-colors ${
                                isToday 
                                    ? "bg-green-500 text-white font-bold" 
                                    : isCompleted 
                                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                                        : isIncomplete 
                                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                            : "hover:bg-gray-200"
                            }`}
                            onClick={() => onDateClick?.(dateString)}
                            title={
                                isCompleted 
                                    ? "Asistencia completa" 
                                    : isIncomplete 
                                        ? "Asistencia incompleta" 
                                        : undefined
                            }
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthlyCalendar;
