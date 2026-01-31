"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AttendanceRecord } from "@/stores/attendance-store";
import Image from "next/image";
import { API_CONFIG } from "@/lib/config/api";
import { useEffect, useRef } from "react";

interface AttendanceHistoryListProps {
    records: AttendanceRecord[];
}

export default function AttendanceHistoryList({ records }: AttendanceHistoryListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to top when new record is added
    useEffect(() => {
        if (listRef.current && records.length > 0) {
            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [records.length]);

    if (records.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                    <p className="mb-2">📋 Sin registros de asistencia</p>
                    <p className="text-sm">Los estudiantes aparecerán aquí al escanear su credencial</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={listRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
                {records.map((record, index) => (
                    <motion.div
                        key={`${record.id}-${record.scannedAt.getTime()}`}
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        layout
                    >
                        <AttendanceRecordCard record={record} isLatest={index === 0} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

interface AttendanceRecordCardProps {
    record: AttendanceRecord;
    isLatest: boolean;
}

function AttendanceRecordCard({ record, isLatest }: AttendanceRecordCardProps) {
    const photoUrl = record.photo_url
        ? `${API_CONFIG.API_BASE_URL}/private-image/${record.photo_url}`
        : "/Avatar.svg";

    const timeAgo = getTimeAgo(record.scannedAt);

    return (
        <article
            className={`relative overflow-hidden rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${isLatest
                    ? 'border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Photo */}
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-square overflow-hidden rounded-lg shadow-sm bg-gray-100">
                        <Image
                            src={photoUrl}
                            alt={record.name}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = "/Avatar.svg")}
                            width={64}
                            height={64}
                            unoptimized
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {record.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.grade} {record.group}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timeAgo}
                        </span>
                    </div>
                </div>

                {/* Source indicator */}
                {isLatest && (
                    <div className="shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 animate-pulse">
                            ✓ Reciente
                        </span>
                    </div>
                )}
            </div>

            {/* Subtle gradient overlay for latest */}
            {isLatest && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400"></div>
            )}
        </article>
    );
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Hace unos segundos';
    if (seconds < 120) return 'Hace 1 minuto';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 7200) return 'Hace 1 hora';
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 172800) return 'Hace 1 día';
    return `Hace ${Math.floor(seconds / 86400)} días`;
}
