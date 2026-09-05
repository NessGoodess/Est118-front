import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api"
import type { GalleryRawItem, GalleryUpsertPayload } from "@/features/gallery/types/gallery"

/** All albums for the admin table (published and drafts). */
export async function getGalleries(): Promise<GalleryRawItem[]> {
  try {
    const response = await apiClient.get<GalleryRawItem[]>(
      API_ENDPOINTS.GALLERIES.GET_ALL,
      { params: { manage: true } }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/** Single album for the admin form. */
export async function getGallery(id: number | string): Promise<GalleryRawItem> {
  try {
    const response = await apiClient.get<GalleryRawItem>(
      API_ENDPOINTS.GALLERIES.GET_ONE(id),
      { params: { manage: true } }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function createGallery(
  payload: GalleryUpsertPayload
): Promise<GalleryRawItem> {
  try {
    const response = await apiClient.post<GalleryRawItem>(
      API_ENDPOINTS.GALLERIES.CREATE,
      payload
    )
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function updateGallery(
  id: number | string,
  payload: GalleryUpsertPayload
): Promise<GalleryRawItem> {
  try {
    const response = await apiClient.patch<GalleryRawItem>(
      API_ENDPOINTS.GALLERIES.UPDATE(id),
      payload
    )
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function deleteGallery(id: number | string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.GALLERIES.DELETE(id))
  } catch (error) {
    throw handleApiError(error)
  }
}
