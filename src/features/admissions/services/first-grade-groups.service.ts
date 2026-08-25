import apiClient, { API_ENDPOINTS } from "@/lib/api";

export type FirstGradeGroupOption = {
  id: number;
  name: string;
  label: string;
  active_count: number;
};

export async function getFirstGradeGroups(
  academicYearId: number
): Promise<FirstGradeGroupOption[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: FirstGradeGroupOption[];
  }>(API_ENDPOINTS.ADMISSION.FIRST_GRADE_GROUPS(academicYearId));
  return response.data.data ?? [];
}
