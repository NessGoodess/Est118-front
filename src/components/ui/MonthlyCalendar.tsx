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
  selectedDate?: string;
  onDateClick?: (date: string) => void;
}

const MonthlyCalendar: FC<CalendarProps> = ({
  markedDates,
  selectedDate,
  onDateClick,
}) => {
  const today: Date = new Date();
  const initial = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
  const [currentDate, setCurrentDate] = useState<Date>(initial);

  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth();

  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  const firstDay: number = new Date(year, month, 1).getDay();

  const monthNames: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const handlePrevMonth = (): void => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white text-black w-full max-w-lg mx-auto border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <h2 className="text-lg font-bold">
          {monthNames[month]} {year}
        </h2>
        <button
          type="button"
          onClick={handleNextMonth}
          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d: string) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {Array.from({ length: firstDay }).map((_, i: number) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i: number) => {
          const day: number = i + 1;
          const isToday: boolean =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateString;
          const isCompleted = markedDates?.completedDates?.includes(dateString);
          const isIncomplete = markedDates?.incompleteDates?.includes(dateString);

          let dayClass =
            "p-2 m-1 rounded-full cursor-pointer transition-colors text-sm ";
          if (isSelected) {
            dayClass += "bg-blue-600 text-white font-bold ring-2 ring-blue-300";
          } else if (isToday) {
            dayClass += "bg-green-500 text-white font-bold";
          } else if (isCompleted) {
            dayClass += "bg-blue-500 text-white hover:bg-blue-600";
          } else if (isIncomplete) {
            dayClass += "bg-yellow-500 text-white hover:bg-yellow-600";
          } else {
            dayClass += "hover:bg-gray-200";
          }

          return (
            <button
              key={day}
              type="button"
              className={dayClass}
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
