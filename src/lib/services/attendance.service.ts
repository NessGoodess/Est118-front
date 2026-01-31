import apiClient from '@/lib/config/api';
import { API_ENDPOINTS } from '@/lib/config/api';
import { CurrentStudent } from '@/lib/types/echo';

/**
 * Fetch the most recent student who scanned their credential
 */
export async function getCurrentStudent(): Promise<CurrentStudent | null> {
    try {
        const response = await apiClient.get<CurrentStudent>(API_ENDPOINTS.ATTENDANCE.CURRENT_STUDENT);
        return response.data;
    } catch (error) {
        console.error('Error fetching current student:', error);
        return null;
    }
}

/**
 * Fetch recent attendance history
 * @param limit - Number of records to fetch (default: 20)
 */
export async function getAttendanceHistory(limit: number = 20): Promise<CurrentStudent[]> {
    try {
        const response = await apiClient.get<CurrentStudent[]>(
            `${API_ENDPOINTS.ATTENDANCE.HISTORY}?limit=${limit}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        return [];
    }
}
