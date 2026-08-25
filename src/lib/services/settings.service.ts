import apiClient, { API_ENDPOINTS } from "@/lib/api";
import { AdmissionCycle, CreateAdmissionCyclePayload, AdmissionStatus } from "@/features/admissions/types/settings";

export const settingsService = {
    /**
     * Get admission cycles
     */
    getCycles: async (): Promise<AdmissionCycle[]> => {
        const response = await apiClient.get<AdmissionCycle[]>(API_ENDPOINTS.ADMISSION.CYCLES);
        return response.data;
    },

    /**
     * Create a new admission cycle
     */
    createCycle: async (data: CreateAdmissionCyclePayload): Promise<AdmissionCycle> => {
        const response = await apiClient.post<AdmissionCycle>(API_ENDPOINTS.ADMISSION.CYCLES, data);
        return response.data;
    },

    /**
     * Activate a cycle
     */
    activateCycle: async (id: number): Promise<{ message: string }> => {
        const response = await apiClient.patch<{ message: string }>(API_ENDPOINTS.ADMISSION.CYCLE_ACTIVATE(id));
        return response.data;
    },

    /**
     * Close a cycle
     */
    closeCycle: async (id: number): Promise<{ message: string }> => {
        const response = await apiClient.patch<{ message: string }>(API_ENDPOINTS.ADMISSION.CYCLE_CLOSE(id));
        return response.data;
    },

    /**
     * Reopen a closed cycle with optional new end date
     */
    reopenCycle: async (id: number, endAt?: string): Promise<{ message: string }> => {
        const response = await apiClient.patch<{ message: string }>(
            API_ENDPOINTS.ADMISSION.CYCLE_REOPEN(id),
            endAt ? { end_at: endAt } : {}
        );
        return response.data;
    },

    /**
     * Delete a draft cycle
     */
    deleteCycle: async (id: number): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(API_ENDPOINTS.ADMISSION.CYCLE_DELETE(id));
        return response.data;
    },

    /**
     * Get public status of admissions
     */
    getAdmissionStatus: async (): Promise<AdmissionStatus> => {
        const response = await apiClient.get<AdmissionStatus>(API_ENDPOINTS.ADMISSION.STATUS);
        return response.data;
    }
};
