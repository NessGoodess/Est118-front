import { hydrateGalleryRefs } from "@/features/gallery/lib/hydrate-gallery-refs"
import { getPublicEvent, getPublicEvents } from "@/features/events/services/public"
import type { EventRawItem, PublicEvent } from "@/features/events/types/event"

function dateLabel(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function timeLabel(value: string): string | undefined {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
}

export function mapEventFromApi(api: EventRawItem): PublicEvent {
  return {
    id: String(api.id),
    slug: api.slug,
    title: api.title,
    type: api.type,
    summary: api.summary ?? undefined,
    location: api.location ?? undefined,
    cover: api.cover_src ?? undefined,
    important: api.important,
    galleryId: api.gallery_id ?? undefined,
    startsAt: api.starts_at,
    endsAt: api.ends_at ?? undefined,
    dateLabel: dateLabel(api.starts_at),
    timeLabel: timeLabel(api.starts_at),
    contentBlocks: api.content_blocks ?? [],
  }
}

/** Published events. Never throws: an API outage shows an empty state. */
export async function getPublicEventList(
  options: { upcoming?: boolean; limit?: number } = {}
): Promise<PublicEvent[]> {
  try {
    const data = await getPublicEvents(options)
    return data.map(mapEventFromApi)
  } catch {
    return []
  }
}

/** Events of a school year, used by the public calendar. */
export async function getCalendarEvents(): Promise<PublicEvent[]> {
  return getPublicEventList()
}

export async function getPublicEventByIdOrSlug(
  idOrSlug: string
): Promise<PublicEvent | null> {
  try {
    const data = await getPublicEvent(idOrSlug)
    if (!data) return null

    const event = mapEventFromApi(data)
    const blocks = [...event.contentBlocks]
    const hasLinkedAlbum =
      Boolean(event.galleryId) &&
      blocks.some(
        (block) => block.type === "gallery_ref" && block.galleryId === event.galleryId
      )

    if (event.galleryId && !hasLinkedAlbum) {
      blocks.push({
        type: "gallery_ref",
        galleryId: event.galleryId,
        layout: "carousel",
      })
    }

    return {
      ...event,
      contentBlocks: await hydrateGalleryRefs(blocks),
    }
  } catch {
    return null
  }
}
