import apiClient, { API_ENDPOINTS } from '@/lib/config/api';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem } from '@/lib/types/admission/preEnrollmentApi';

/**
 * Fetch all pre-enrollments
 */
export async function getPreEnrollments(page: number = 1): Promise<PaginatedResponse<PreEnrollmentListItem>> {

        const response = await apiClient.get<PaginatedResponse<PreEnrollmentListItem>>(API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS, {
                params: { page }
        });
        return response.data;
}

/**
 * Fetch a single pre-enrollment by ID
 */
export async function getPreEnrollmentById(id: number): Promise<PreEnrollmentListItem> {
        const response = await apiClient.get<PreEnrollmentListItem>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}`);
        return response.data;
}