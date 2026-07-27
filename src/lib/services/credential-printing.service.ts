import apiClient, { API_ENDPOINTS } from "@/lib/api";
import type {
  ClassGroupsResponse,
  CredentialRowsResponse,
  CredentialTrackingState,
} from "@/lib/types/credential-printing";

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function fetchCredentialClassGroups(
  gradeId: number
): Promise<ClassGroupsResponse["data"]> {
  const res = await apiClient.get<ClassGroupsResponse>(
    API_ENDPOINTS.CREDENTIAL_CLASS_GROUPS(gradeId)
  );
  return res.data.data;
}

export async function fetchCredentialRows(
  classGroupId: number
): Promise<CredentialRowsResponse["data"]> {
  const res = await apiClient.get<CredentialRowsResponse>(
    API_ENDPOINTS.CREDENTIAL_ROWS(classGroupId)
  );
  return res.data.data;
}

export async function downloadCredentialExcel(classGroupId: number): Promise<void> {
  const res = await apiClient.get(API_ENDPOINTS.CREDENTIAL_EXPORT(classGroupId), {
    responseType: "blob",
    timeout: 120_000,
  });
  const cd = res.headers["content-disposition"] as string | undefined;
  let filename = `credenciales_grupo_${classGroupId}.xlsx`;
  if (cd) {
    const m = /filename="?([^";]+)"?/i.exec(cd);
    if (m?.[1]) filename = m[1];
  }
  triggerBlobDownload(res.data as Blob, filename);
}

export async function downloadCredentialPhotosZip(
  classGroupId: number
): Promise<void> {
  const res = await apiClient.get(API_ENDPOINTS.CREDENTIAL_PHOTOS_ZIP(classGroupId), {
    responseType: "blob",
    timeout: 300_000,
    validateStatus: (s) => s < 500,
  });
  const type = (res.headers["content-type"] as string) || "";
  if (type.includes("application/json")) {
    const text = await (res.data as Blob).text();
    const body = JSON.parse(text) as { message?: string };
    throw new Error(body.message || "No se pudo generar el ZIP de fotos.");
  }
  triggerBlobDownload(res.data as Blob, `fotos_credencial_grupo_${classGroupId}.zip`);
}

export async function patchCredentialTracking(
  studentId: number,
  academicYearId: number,
  patch: Partial<CredentialTrackingState>
): Promise<{ tracking: CredentialTrackingState }> {
  const res = await apiClient.patch<{
    success: boolean;
    data: { tracking: CredentialTrackingState };
  }>(API_ENDPOINTS.CREDENTIAL_TRACKING(studentId), {
    academic_year_id: academicYearId,
    ...patch,
  });
  return res.data.data;
}
