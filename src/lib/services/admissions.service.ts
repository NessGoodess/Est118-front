import apiClient, { API_ENDPOINTS } from '@/lib/config/api';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem, PreEnrollmentApi, AdmissionCycle } from '@/lib/types/admission/preEnrollmentApi';
import { PendingPromotionDecisionItem, PromotionDecisionApiResponse } from '@/lib/types/admission/promotion';
import { AcademicYearListItem, PromoteAcademicYearSummary } from '@/lib/types/academic-year';
import { FirstGradeAssignmentResult, ScoreSource } from '@/lib/types/admission/first-grade-assignment';
import { AxiosRequestConfig } from 'axios';

/**
 * Fetch all admission cycles
 */
export async function getAdmissionCycles(): Promise<AdmissionCycle[]> {
        const response = await apiClient.get<AdmissionCycle[]>(API_ENDPOINTS.ADMISSION.CYCLES);
        return response.data;
}


/**
 * Fetch all pre-enrollments
 */
export async function getPreEnrollments(page: number = 1, cycleId?: number | null): Promise<PaginatedResponse<PreEnrollmentListItem>> {

        const response = await apiClient.get<PaginatedResponse<PreEnrollmentListItem>>(API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS, {
                params: { page, cycle_id: cycleId || undefined }
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
 * Create a new pre-enrollment from the Admin panel
 */
export async function createPreEnrollmentByAdmin(data: Record<string, unknown> | FormData, config?: AxiosRequestConfig): Promise<{ folio: string, downloadUrl: string, message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS, data, config);
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
 * Update only process fields for pre-enrollment.
 */
export async function updatePreEnrollmentProcess(
        id: number,
        data: Partial<Pick<PreEnrollmentApi, 'status' | 'documents_status' | 'payment_status' | 'admission_exam_score'>>
): Promise<PreEnrollmentApi> {
        const response = await apiClient.patch<PreEnrollmentApi>(
                `${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}/process`,
                data
        );
        return response.data;
}

/** Create student + enrollment from a ready pre-enrollment. */
export async function convertPreEnrollmentToStudent(
        id: number,
        payload?: { academic_year_id?: number; class_group_id?: number }
): Promise<{ student_id: number; enrollment_id: number }> {
        const response = await apiClient.post<{
                success: boolean;
                data: { student_id: number; enrollment_id: number };
                message?: string;
        }>(`${API_ENDPOINTS.ADMISSION.PRE_ENROLLMENTS}/${id}/convert-student`, payload ?? {});

        return response.data.data;
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

/**
 * Fetch enrollments with pending final decision (approved/reproved).
 */
export async function getPendingPromotionDecisions(academicYearId?: number): Promise<PendingPromotionDecisionItem[]> {
        const response = await apiClient.get<{ success: boolean; data: PendingPromotionDecisionItem[] }>(
                API_ENDPOINTS.ADMISSION.ENROLLMENTS_PENDING_DECISIONS,
                {
                        params: academicYearId ? { academic_year_id: academicYearId } : undefined
                }
        );

        return response.data.data ?? [];
}

/**
 * Save final decision for one enrollment.
 */
export async function updatePromotionDecision(enrollmentId: number, isApproved: boolean): Promise<PromotionDecisionApiResponse> {
        const response = await apiClient.patch<PromotionDecisionApiResponse>(
                API_ENDPOINTS.ADMISSION.ENROLLMENT_PROMOTION_DECISION(enrollmentId),
                { is_approved: isApproved }
        );

        return response.data;
}

/**
 * Academic years list
 */
export async function getAcademicYears(): Promise<AcademicYearListItem[]> {
        const response = await apiClient.get<{ success: boolean; data: AcademicYearListItem[] }>(
                API_ENDPOINTS.ACADEMIC_YEARS.LIST
        );
        return response.data.data ?? [];
}

/**
 * Run annual promotion (dry-run or real).
 */
export async function runAcademicYearPromotion(payload: {
        from_academic_year_id: number;
        to_academic_year_id: number;
        dry_run?: boolean;
}): Promise<PromoteAcademicYearSummary> {
        const response = await apiClient.post<{ success: boolean; data: PromoteAcademicYearSummary }>(
                API_ENDPOINTS.ACADEMIC_YEARS.PROMOTE,
                payload
        );
        return response.data.data;
}

/**
 * First-grade (new admission) group assignment with simulation/apply modes.
 */
export async function assignFirstGradeGroups(payload: {
        academic_year_id: number;
        score_source: ScoreSource;
        dry_run?: boolean;
        overrides?: Array<{ enrollment_id: number; class_group_id: number }>;
}): Promise<FirstGradeAssignmentResult> {
        const response = await apiClient.post<{ success: boolean; data: FirstGradeAssignmentResult }>(
                API_ENDPOINTS.ADMISSION.FIRST_GRADE_GROUP_ASSIGNMENT,
                payload
        );
        return response.data.data;
}
