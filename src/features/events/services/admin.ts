import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api"
import type { EventRawItem, EventUpsertPayload } from "@/features/events/types/event"

/** All events for the admin table (published and drafts). */
export async function getEvents(): Promise<EventRawItem[]> {
  try {
    const response = await apiClient.get<EventRawItem[]>(API_ENDPOINTS.EVENTS.GET_ALL, {
      params: { manage: true },
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getEvent(id: number | string): Promise<EventRawItem> {
  try {
    const response = await apiClient.get<EventRawItem>(API_ENDPOINTS.EVENTS.GET_ONE(id), {
      params: { manage: true },
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function createEvent(payload: EventUpsertPayload): Promise<EventRawItem> {
  try {
    const response = await apiClient.post<EventRawItem>(API_ENDPOINTS.EVENTS.CREATE, payload)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function updateEvent(
  id: number | string,
  payload: EventUpsertPayload
): Promise<EventRawItem> {
  try {
    const response = await apiClient.patch<EventRawItem>(API_ENDPOINTS.EVENTS.UPDATE(id), payload)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function deleteEvent(id: number | string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id))
  } catch (error) {
    throw handleApiError(error)
  }
}
