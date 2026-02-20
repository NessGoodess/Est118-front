"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AttendanceRecord } from "@/stores/attendance-store";
import Image from "next/image";
import { getPrivateImageProxyUrl } from "@/lib/config/api";
import { useEffect, useRef } from "react";
import { formatRelative } from "@/lib/utils/dateFormatter";
import { IconByName } from "@/components/ui/icons/attendenceCard.icons";

interface AttendanceHistoryListProps {
    records: AttendanceRecord[];
    loading: boolean;
}

export default function AttendanceHistoryList({ records, loading }: AttendanceHistoryListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current && records.length > 0) {
            listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [records.length]);

    if (!loading && records.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                    <p className="mb-2">Sin registros de asistencia</p>
                </div>
            </div>
        );
    } else if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div ref={listRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
                {records.map((record, index) => (
                    <motion.div
                        key={`${record.id}-${record.scannedAt.getTime()}`}
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
    const photoUrl = record.photo_url
        ? getPrivateImageProxyUrl(record.photo_url)
        : "/avatar-m.svg";

    const timeAgo = formatRelative(record.scannedAt);

    return (
        <div
            className={`relative overflow-hidden rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${isLatest
                ? 'border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`} >
            <div className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-3/4 overflow-hidden rounded-lg shadow-sm bg-gray-100">
                        <Image
                            src={photoUrl}
                            alt={record.name}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = "/avatar-m.svg")}
                            width={64}
                            height={64}
                            unoptimized
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {record.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.grade} {record.group}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
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
function Loading() {
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
        <div className="relative overflow-hidden rounded-xl bg-slate-200 shadow-md border-2 transition-all duration-300 hover:shadow-lg animate-pulse" >
            <div className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 shrink-0">
                    <div className="aspect-3/4 overflow-hidden rounded-lg shadow-sm bg-gray-100">
                        <Image src={"/avatar-m.svg"} alt={""} className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold bg-slate-300 h-6 rounded-lg"></h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-slate-300 h-6 w-6"></div>
                        <div className="bg-slate-300 flex items-center gap-1 h-6 w-32 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}