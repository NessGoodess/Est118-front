import apiClient, { API_ENDPOINTS } from "@/lib/api";
import type {
  AcademicYearListItem,
  CreateAcademicYearPayload,
} from "@/features/academic-years/types/academic-year";

export async function getAcademicYearsList(): Promise<AcademicYearListItem[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: AcademicYearListItem[];
  }>(API_ENDPOINTS.ACADEMIC_YEARS.LIST);
  return response.data.data ?? [];
}

export async function createAcademicYear(
  payload: CreateAcademicYearPayload
): Promise<AcademicYearListItem> {
  const response = await apiClient.post<{
    success: boolean;
    data: AcademicYearListItem;
  }>(API_ENDPOINTS.ACADEMIC_YEARS.LIST, payload);
  return response.data.data;
}

export async function activateAcademicYear(
  id: number
): Promise<AcademicYearListItem> {
  const response = await apiClient.patch<{
    success: boolean;
    data: AcademicYearListItem;
  }>(API_ENDPOINTS.ACADEMIC_YEARS.ACTIVATE(id));
  return response.data.data;
}

export async function generateAcademicYearGroups(
  id: number
): Promise<{ created: number }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { created: number };
  }>(API_ENDPOINTS.ACADEMIC_YEARS.GENERATE_GROUPS(id));
  return response.data.data;
}

export async function deleteAcademicYear(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ACADEMIC_YEARS.DETAIL(id));
}
