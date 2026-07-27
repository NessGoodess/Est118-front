import apiClient, { API_ENDPOINTS } from '@/lib/api';
import {
  ReEnrollmentApplicationRow,
  ReEnrollmentDashboardStats,
  ReEnrollmentPeriod,
  ReEnrollmentProcessStep,
} from '@/lib/types/school/re-enrollment';

export async function getReEnrollmentPeriods(): Promise<ReEnrollmentPeriod[]> {
  const response = await apiClient.get<{ success: boolean; data: ReEnrollmentPeriod[] }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIODS
  );
  return response.data.data ?? [];
}

export async function createReEnrollmentPeriod(payload: {
  name: string;
  from_academic_year_id: number;
  to_academic_year_id: number;
  start_at: string;
  end_at: string;
  keep_current_groups?: boolean;
}): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.post<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIODS,
    payload
  );
  return response.data.data;
}

export async function updateReEnrollmentPeriod(
  id: number,
  payload: Partial<{
    name: string;
    start_at: string;
    end_at: string;
    keep_current_groups: boolean;
    current_step: ReEnrollmentProcessStep;
  }>
): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.patch<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD(id),
    payload
  );
  return response.data.data;
}

export async function openReEnrollmentPeriod(id: number): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.patch<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_OPEN(id)
  );
  return response.data.data;
}

export async function closeReEnrollmentPeriod(id: number): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.patch<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_CLOSE(id)
  );
  return response.data.data;
}

export async function getReEnrollmentDashboard(id: number): Promise<ReEnrollmentDashboardStats> {
  const response = await apiClient.get<{ success: boolean; data: ReEnrollmentDashboardStats }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_DASHBOARD(id)
  );
  return response.data.data;
}

export async function advanceReEnrollmentStep(id: number): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.post<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_ADVANCE(id)
  );
  return response.data.data;
}

export async function finalizeReEnrollmentPeriod(
  id: number,
  activateAcademicYear = false
): Promise<ReEnrollmentPeriod> {
  const response = await apiClient.post<{ success: boolean; data: ReEnrollmentPeriod }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_FINALIZE(id),
    { activate_academic_year: activateAcademicYear }
  );
  return response.data.data;
}

export async function promoteReEnrollmentPeriod(
  id: number,
  dryRun = false
): Promise<{ summary: import('@/lib/types/academic-year').PromoteAcademicYearSummary; period: ReEnrollmentPeriod }> {
  const response = await apiClient.post<{
    success: boolean;
    data: import('@/lib/types/academic-year').PromoteAcademicYearSummary;
    period: ReEnrollmentPeriod;
  }>(API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_PROMOTE(id), { dry_run: dryRun });

  return { summary: response.data.data, period: response.data.period };
}

export async function getReEnrollmentHistory(id: number) {
  const response = await apiClient.get<{ success: boolean; data: import('@/lib/types/school/re-enrollment').ReEnrollmentEventItem[] }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.PERIOD_HISTORY(id)
  );
  return response.data.data ?? [];
}

export async function getReEnrollmentApplications(
  periodId: number,
  params?: { status?: string; grade?: string; group?: string }
): Promise<ReEnrollmentApplicationRow[]> {
  const response = await apiClient.get<{ success: boolean; data: ReEnrollmentApplicationRow[] }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.APPLICATIONS(periodId),
    { params }
  );
  return response.data.data ?? [];
}

export async function updateReEnrollmentApplication(
  periodId: number,
  applicationId: number,
  payload: Partial<ReEnrollmentApplicationRow>
): Promise<ReEnrollmentApplicationRow> {
  const response = await apiClient.patch<{ success: boolean; data: ReEnrollmentApplicationRow }>(
    API_ENDPOINTS.SCHOOL.RE_ENROLLMENT.APPLICATION(periodId, applicationId),
    payload
  );
  return response.data.data;
}
