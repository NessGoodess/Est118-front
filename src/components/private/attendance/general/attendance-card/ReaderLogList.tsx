"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AttendanceRecord } from "@/stores/attendance-store";
import Image from "next/image";
import { getPrivateImageUrl } from "@/lib/api";
import { useEffect, useRef } from "react";
import { formatRelative } from "@/lib/utils/dateFormatter";
import { IconByName } from "@/components/ui/icons/attendenceCard.icons";

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
        return <LoadingSkeleton />;
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
        <div ref={listRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
            className={`relative overflow-hidden rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${isLatest
                ? 'border-primary bg-linear-to-r from-primary-soft to-primary-soft'
                : 'border-border bg-surface-elevated hover:border-border'
                }`} >
            <div className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-3/4 overflow-hidden rounded-lg shadow-sm bg-surface-muted">
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

/**
 * Attendance history list skeleton
 */
function LoadingSkeleton() {
    return (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
                {[1, 2, 3, 4].map((record, index) => (
                    <motion.div
                        key={`${record}-${index}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        layout
                    >
                        <AttendanceRecordCardSkeleton />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function AttendanceRecordCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-surface-muted shadow-md border-2 transition-all duration-300 hover:shadow-lg animate-pulse" >
            <div className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-3/4 overflow-hidden rounded-lg shadow-sm bg-surface-muted">
                        <Image src={"/avatar-m.svg"} alt={"avatar de estudiante"} className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold bg-loading-base h-6 rounded-lg"></h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-loading-base h-6 w-6"></div>
                        <div className="bg-loading-base flex items-center gap-1 h-6 w-32 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}