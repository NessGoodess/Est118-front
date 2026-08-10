"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AttendanceRecord } from "@/features/general-attendance/stores/attendance-store";
import Image from "next/image";
import { getPrivateImageUrl } from "@/lib/api";
import { useEffect, useRef } from "react";
import { formatRelative } from "@/lib/utils/dateFormatter";
import { IconByName } from "@/components/ui/icons/attendenceCard.icons";
import ReaderLogListSkeleton from "@/features/general-attendance/components/skeletons/ReaderLogListSkeleton";

interface ReaderLogListProps {
    records: AttendanceRecord[];
    loading: boolean;
}

export default function ReaderLogList({ records, loading }: ReaderLogListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current && records.length > 0) {
            const { scrollTop } = listRef.current;
            if (scrollTop < 100) {
                listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [records.length]);

    if (loading) {
        return <ReaderLogListSkeleton />;
    }
    if (records.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-fg-muted text-lg">
                    <p className="mb-2">Sin registros de asistencia recientes.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-2xl">
            <div className="border-b border-border bg-gradient-to-r from-surface-muted to-primary-soft px-3 py-3 sm:px-4">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground">Lecturas recientes</h3>
                    <span className="rounded-full bg-primary-soft px-2 py-0 text-sm font-bold text-primary">
                        {records.length}
                    </span>
                </div>
                <p className="text-sm text-fg-muted">
                    Bitácora de eventos NFC (entrada, salida, ignoradas)
                </p>
            </div>
            <div className="space-y-2 p-2 lg:p-4">

                <AnimatePresence initial={false}>
                    {records.map((record, index) => (
                        <motion.div
                            key={record.feed_id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            layout
                        >
                            <AttendanceRecordCard record={record} isLatest={index === 0} />
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>
        </div>
    )
}

interface AttendanceRecordCardProps {
    record: AttendanceRecord;
    isLatest: boolean;
}

function AttendanceRecordCard({ record, isLatest }: AttendanceRecordCardProps) {
    const fallbackAvatar = record.gender === "F" ? "/avatar-f.svg" : "/avatar-m.svg";
    const photoUrl = record.photo_url
        ? getPrivateImageUrl(record.photo_url)
        : fallbackAvatar;

    const timeAgo = record.scannedAt ? formatRelative(record.scannedAt) : 'Fecha no disponible';

    return (
        <div
            className={`relative overflow-hidden rounded-xl shadow-md border transition-all duration-300 hover:shadow-lg ${isLatest
                ? 'border-primary bg-linear-to-r from-primary-soft to-primary-soft'
                : 'border-border bg-surface-elevated hover:border-border'
                }`} >
            <div className="flex items-center gap-4 p-1 lg:p-2">
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-square overflow-hidden rounded-lg shadow-sm bg-surface-muted">
                        <Image
                            src={photoUrl}
                            alt={record?.name ? `Foto de ${record.name}` : "Foto del Estudiante"}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = fallbackAvatar)}
                            width={64}
                            height={64}
                            unoptimized
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-lg">
                        {record.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-soft text-primary">
                            {record.grade} {record.group}
                        </span>
                        {(record.reader_label || record.reader_slot_code) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                                {record.reader_label || record.reader_slot_code}
                            </span>
                        )}
                        {(record.message || record.event) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-foreground">
                                {record.message ?? record.event}
                            </span>
                        )}
                        <span className="text-sm text-fg-muted flex items-center gap-1">
                            <IconByName name="timer" className="w-4 h-4" />
                            {timeAgo}
                        </span>
                    </div>
                </div>

            </div>
        </div>

    );
}
