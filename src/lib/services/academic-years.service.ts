import apiClient, { API_ENDPOINTS } from '@/lib/api';
import { AcademicYearListItem } from '@/lib/types/academic-year';

export async function getAcademicYearsList(): Promise<AcademicYearListItem[]> {
  const response = await apiClient.get<{ success: boolean; data: AcademicYearListItem[] }>(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST
  );
  return response.data.data ?? [];
}

export async function createAcademicYear(payload: {
  year_start: string;
  year_end: string;
  description?: string;
  generate_class_groups?: boolean;
}): Promise<AcademicYearListItem> {
  const response = await apiClient.post<{ success: boolean; data: AcademicYearListItem }>(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST,
    payload
  );
  return response.data.data;
}

export async function activateAcademicYear(id: number): Promise<AcademicYearListItem> {
  const response = await apiClient.patch<{ success: boolean; data: AcademicYearListItem }>(
    API_ENDPOINTS.ACADEMIC_YEARS.ACTIVATE(id)
  );
  return response.data.data;
}

export async function generateAcademicYearGroups(id: number): Promise<{ created: number }> {
  const response = await apiClient.post<{ success: boolean; data: { created: number } }>(
    API_ENDPOINTS.ACADEMIC_YEARS.GENERATE_GROUPS(id)
  );
  return response.data.data;
}

export async function deleteAcademicYear(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ACADEMIC_YEARS.DETAIL(id));
}
