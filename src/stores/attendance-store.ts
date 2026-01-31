import { create } from 'zustand';
import { CurrentStudent } from '@/lib/types/echo';

export interface AttendanceRecord extends CurrentStudent {
    scannedAt: Date;
    source: 'websocket' | 'api';
}

interface AttendanceStore {
    records: AttendanceRecord[];
    addRecord: (student: CurrentStudent, source: 'websocket' | 'api') => void;
    setInitialRecords: (students: CurrentStudent[]) => void;
    clearRecords: () => void;
    getLatestRecord: () => AttendanceRecord | null;
}

const MAX_RECORDS = 50;
const DUPLICATE_THRESHOLD_MS = 5000; // 5 seconds

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
    records: [],

    addRecord: (student, source) => {
        const now = new Date();
        const { records } = get();

        // Check for duplicates within the threshold
        const isDuplicate = records.some(
            (record) =>
                record.id === student.id &&
                now.getTime() - record.scannedAt.getTime() < DUPLICATE_THRESHOLD_MS
        );

        if (isDuplicate) {
            console.log('Duplicate record detected, skipping:', student.name);
            return;
        }

        // Create new record
        const newRecord: AttendanceRecord = {
            ...student,
            scannedAt: now,
            source,
        };

        // Add to beginning of array (newest first) and limit to MAX_RECORDS
        set({
            records: [newRecord, ...records].slice(0, MAX_RECORDS),
        });
    },

    setInitialRecords: (students) => {
        const records: AttendanceRecord[] = students.map((student) => ({
            ...student,
            scannedAt: new Date(student.registered_at),
            source: 'api' as const,
        }));

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
