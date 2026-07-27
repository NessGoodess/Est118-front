import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api';
import { CurrentStudent } from '@/lib/types/echo';
import {
  DailyAttendanceResponse,
  DailyAttendanceStatusesResponse,
} from '@/lib/types/general-attendance';

/**
 * Fetch the most recent student who scanned their credential
 */
export async function getCurrentStudent(): Promise<CurrentStudent | null> {
    try {
        const response = await apiClient.get<CurrentStudent>(API_ENDPOINTS.ATTENDANCE.CURRENT_STUDENT);
        return unwrapResource(response.data);
    } catch (error) {
        console.error('Error fetching current student:', error);
        return null;
    }
}

/**
 * Recent NFC readings for the live feed (not consolidated daily attendance).
 */
export async function getRecentReadings(
    limit: number = 20,
    date?: string
): Promise<CurrentStudent[]> {
    try {
        const response = await apiClient.get(
            API_ENDPOINTS.ATTENDANCE.RECENT_READINGS,
            { params: { limit, date } }
        );
        const payload = unwrapCollection<CurrentStudent>(response.data);
        return Array.isArray(payload) ? payload : [];
    } catch (error) {
        console.error('Error fetching recent readings:', error);
        return [];
    }
}

/**
 * @deprecated Prefer getRecentReadings for the live panel.
 * Kept as alias during transition.
 */
export async function getAttendanceHistory(limit: number = 20): Promise<CurrentStudent[]> {
    return getRecentReadings(limit);
}

/**
 * Consolidated daily roster with effective status and metrics.
 */
export async function getDailyAttendance(date: string): Promise<DailyAttendanceResponse> {
    const response = await apiClient.get<{ success: boolean; data: DailyAttendanceResponse }>(
        API_ENDPOINTS.ATTENDANCE.DAILY,
        { params: { date } }
    );

    if (!response.data?.data) {
        throw new Error('Respuesta inválida del servidor');
    }

    return response.data.data;
}

/**
 * Lightweight statuses for a date (no photos). Merge onto a cached roster.
 */
export async function getDailyAttendanceStatuses(
    date: string
): Promise<DailyAttendanceStatusesResponse> {
    const response = await apiClient.get<{
        success: boolean;
        data: DailyAttendanceStatusesResponse;
    }>(API_ENDPOINTS.ATTENDANCE.DAILY_STATUSES, { params: { date } });

    if (!response.data?.data) {
        throw new Error('Respuesta inválida del servidor');
    }

    return response.data.data;
}

function unwrapResource<T>(data: T | { data: T } | null | undefined): T | null {
    if (data == null) return null;
    if (typeof data === 'object' && data !== null && 'data' in data) {
        return (data as { data: T }).data ?? null;
    }
    return data as T;
}

function unwrapCollection<T>(data: T[] | { data: T[] } | null | undefined): T[] {
    if (data == null) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && 'data' in data && Array.isArray((data as { data: T[] }).data)) {
        return (data as { data: T[] }).data;
    }
    return [];
}
