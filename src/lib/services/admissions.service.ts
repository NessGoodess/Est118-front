import apiClient, { API_ENDPOINTS } from '@/lib/config/api';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem, PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';

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
export async function getPreEnrollmentById(id: number): Promise<PreEnrollmentApi> {
        const response = await apiClient.get<PreEnrollmentApi>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}`);
        return response.data;
}

/**
 * Update pre-enrollment
*/
export async function updatePreEnrollment(id: number, data: Partial<PreEnrollmentApi>): Promise<PreEnrollmentApi> {
        const response = await apiClient.patch<PreEnrollmentApi>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}`, data);
        return response.data;
}

/**
 * Delete pre-enrollment
*/
export async function deletePreEnrollment(id: number): Promise<void> {
        await apiClient.delete<void>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}`);
}

/**
 * Download the SCV for all pre-enrollments
*/
export async function downloadPreEnrollmentSCV(): Promise<Blob> {
        const response = await apiClient.get<Blob>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/download-scv`, {
                responseType: 'blob',
        });
        return response.data;
}


/**
 * Download the Excel for all pre-enrollments
*/

export async function downloadPreEnrollmentExcel(): Promise<Blob> {
        const response = await apiClient.get<Blob>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENT_EXPORT}`, {
                responseType: 'blob',
        });
        return response.data;
}

/**
 * Resent PDF Folio
 */

export interface ResentPDFFolioResponse {
        status: string;
        message: string;
        folio?: string;
}

export async function resentPDFFolio(id: number): Promise<ResentPDFFolioResponse> {
        const response= await apiClient.post<ResentPDFFolioResponse>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}/resent-pdf-folio`);
        return response.data;
}
