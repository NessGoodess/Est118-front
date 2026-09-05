import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api";

/** Storage buckets the API accepts for content uploads. */
export const MEDIA_COLLECTIONS = ["announcements", "galleries", "events"] as const;

export type MediaCollection = (typeof MEDIA_COLLECTIONS)[number];

export interface UploadedMediaFile {
  path: string;
  src: string;
  name: string;
}

export const MEDIA_UPLOAD_BATCH_LIMIT = 20;
export const GALLERY_BLOCK_MAX_PHOTOS = 40;
export const MEDIA_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads a batch of images and returns them in the same order.
 * Images are optimized to WebP server-side.
 */
export async function uploadPublicMedia(
  files: File[],
  collection: MediaCollection
): Promise<UploadedMediaFile[]> {
  const formData = new FormData();
  formData.append("collection", collection);
  files.forEach((file) => formData.append("files[]", file));

  try {
    const response = await apiClient.post<{ files: UploadedMediaFile[] }>(
      API_ENDPOINTS.CONTENT.MEDIA,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.files;
  } catch (error) {
    throw handleApiError(error);
  }
}
