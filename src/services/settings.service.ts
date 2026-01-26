import apiClient, { API_ENDPOINTS } from "@/lib/config/api";
import { AdmissionCycle, CreateAdmissionCyclePayload, AdmissionStatus } from "@/lib/types/settings";

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
     * Get public status of admissions
     */
    getAdmissionStatus: async (): Promise<AdmissionStatus> => {
        const response = await apiClient.get<AdmissionStatus>(API_ENDPOINTS.ADMISSION.STATUS);
        return response.data;
    }
};
