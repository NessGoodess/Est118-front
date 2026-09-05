import { API_ENDPOINTS, buildApiUrl } from "@/lib/api"
import type { EventRawItem, PublicEventsQuery } from "@/features/events/types/event"

/** Published events (fetch so Next.js can cache the response). */
export async function getPublicEvents(
  query: PublicEventsQuery = {}
): Promise<EventRawItem[]> {
  const params = new URLSearchParams()
  if (query.upcoming) params.set("upcoming", "1")
  if (query.from) params.set("from", query.from)
  if (query.to) params.set("to", query.to)
  if (query.limit) params.set("limit", String(query.limit))

  const search = params.toString()
  const url = `${buildApiUrl(API_ENDPOINTS.EVENTS.GET_ALL)}${search ? `?${search}` : ""}`

  const response = await fetch(url, { next: { revalidate: 60 } })

  if (!response.ok) {
    throw new Error("Failed to fetch public events")
  }

  return response.json()
}

export async function getPublicEvent(idOrSlug: string): Promise<EventRawItem | null> {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.EVENTS.GET_ONE(idOrSlug)), {
    next: { revalidate: 60 },
  })

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("Failed to fetch public event")
  }

  return response.json()
}
