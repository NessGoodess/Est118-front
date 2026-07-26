import { create } from 'zustand';
import { CurrentStudent } from '@/lib/types/echo';

export interface AttendanceRecord extends CurrentStudent {
    feed_id: string;
    scannedAt: Date;
    source: 'websocket' | 'api';
    reader_slot_code?: string;
    reader_label?: string;
    reading_id?: number;
    event?: string;
    message?: string;
    type?: string;
}

interface AttendanceStore {
    records: AttendanceRecord[];
    addRecord: (
        student: CurrentStudent & { reading_id?: number; event?: string; message?: string; type?: string },
        source: 'websocket' | 'api',
        meta?: { reader_slot_code?: string; reader_label?: string }
    ) => void;
    setInitialRecords: (students: CurrentStudent[]) => void;
    clearRecords: () => void;
    getLatestRecord: () => AttendanceRecord | null;
}

const MAX_RECORDS = 50;

let feedSeq = 0;

function nextFeedId(readingId?: number): string {
    feedSeq += 1;
    if (readingId != null) {
        return `reading-${readingId}`;
    }
    return `feed-${Date.now()}-${feedSeq}`;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
    records: [],

    addRecord: (student, source, meta) => {
        const now = new Date();
        const { records } = get();

        if (student.reading_id != null) {
            const alreadyShown = records.some((record) => record.reading_id === student.reading_id);
            if (alreadyShown) {
                return;
            }
        }

        const scannedAt = student.registered_at
            ? new Date(student.registered_at)
            : now;

        const newRecord: AttendanceRecord = {
            ...student,
            feed_id: nextFeedId(student.reading_id),
            scannedAt: Number.isNaN(scannedAt.getTime()) ? now : scannedAt,
            source,
            reader_slot_code: meta?.reader_slot_code,
            reader_label: meta?.reader_label,
            reading_id: student.reading_id,
            event: student.event,
            message: student.message,
            type: student.type,
        };

        set({
            records: [newRecord, ...records].slice(0, MAX_RECORDS),
        });
    },

    setInitialRecords: (students) => {
        const records: AttendanceRecord[] = students.map((student) => {
            const scannedAt = student.registered_at
                ? new Date(student.registered_at)
                : new Date();
            const readingId = (student as AttendanceRecord).reading_id;

            return {
                ...student,
                feed_id: nextFeedId(readingId),
                scannedAt: Number.isNaN(scannedAt.getTime()) ? new Date() : scannedAt,
                source: 'api' as const,
                reading_id: readingId,
                event: (student as AttendanceRecord).event,
                message: (student as AttendanceRecord).message,
                type: student.type,
            };
        });

        set({ records });
    },

    clearRecords: () => {
        set({ records: [] });
    },

    getLatestRecord: () => {
        const { records } = get();
        return records.length > 0 ? records[0] : null;
    },
}));
