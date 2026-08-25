import apiClient, { API_ENDPOINTS } from "@/lib/api";
import type {
  AdmissionIntakeSettings,
  AdmissionIntakeSettingsPayload,
} from "@/features/admissions/types/intake-settings";

export async function getAdmissionIntakeSettings(): Promise<AdmissionIntakeSettings> {
  const response = await apiClient.get<{
    success: boolean;
    data: AdmissionIntakeSettings;
  }>(API_ENDPOINTS.ADMISSION.INTAKE_SETTINGS);
  return response.data.data;
}

export async function updateAdmissionIntakeSettings(
  payload: AdmissionIntakeSettingsPayload
): Promise<AdmissionIntakeSettings> {
  const response = await apiClient.put<{
    success: boolean;
    data: AdmissionIntakeSettings;
  }>(API_ENDPOINTS.ADMISSION.INTAKE_SETTINGS, payload);
  return response.data.data;
}
