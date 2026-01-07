"use client";
import React from "react";

interface ClassCardProps {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
    subject: string;
    group: string;
    grade_level: string;
    class_group_id: number;
    onClick: (class_group_id: number) => void;
    isSelected?: boolean;
}

export default function ClassCard({

    day,
    start_time,
    end_time,
    subject,
    group,
    grade_level,
    class_group_id,
    onClick,
    isSelected = false
}: ClassCardProps) {
    return (
        <div
            className={`
        min-w-[200px] p-4 rounded-lg border-2 cursor-pointer transition-all
        ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
      `}
            onClick={() => onClick(class_group_id)}
        >
            <h3 className="font-bold text-lg mb-2">{subject}</h3>
            <p className="text-sm text-gray-600">Grado: {grade_level}</p>
            <p className="text-sm text-gray-600">Grupo: {group}</p>
            <p className="text-sm text-gray-600">Día: {day}</p>
            <p className="text-sm text-gray-600">
                Hora: {start_time} - {end_time}
            </p>
        </div>
    );
};
