import type { PublishAction } from "@/features/announcements/lib/announcement-display"
import type { EventRawItem, EventUpsertPayload } from "@/features/events/types/event"
import { EVENT_FORM_DEFAULTS, type EventFormValues } from "@/features/events/validations/event.schema"
import { EVENT_TYPES } from "@/features/events/types/event"

/** "2026-09-04T12:00:00Z" → "2026-09-04T12:00" for datetime-local inputs. */
function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export function mapEventToFormValues(api: EventRawItem): EventFormValues {
  const type = EVENT_TYPES.includes(api.type as (typeof EVENT_TYPES)[number])
    ? (api.type as EventFormValues["type"])
    : EVENT_FORM_DEFAULTS.type

  return {
    title: api.title,
    slug: api.slug ?? "",
    type,
    summary: api.summary ?? "",
    startsAt: toDateTimeLocal(api.starts_at),
    endsAt: toDateTimeLocal(api.ends_at),
    location: api.location ?? "",
    coverSrc: api.cover_src ?? "",
    important: api.important,
    galleryId: api.gallery_id ?? null,
    publishedAt: toDateTimeLocal(api.published_at),
    contentBlocks: api.content_blocks ?? [],
  }
}

export function buildEventPayload(
  data: EventFormValues,
  publishAction: PublishAction
): EventUpsertPayload {
  return {
    title: data.title.trim(),
    slug: data.slug?.trim() || undefined,
    type: data.type,
    summary: data.summary?.trim() || undefined,
    content_blocks: data.contentBlocks,
    starts_at: data.startsAt,
    ends_at: data.endsAt?.trim() || undefined,
    location: data.location?.trim() || undefined,
    cover_src: data.coverSrc?.trim() || undefined,
    important: data.important,
    gallery_id: data.galleryId,
    publish_action: publishAction,
    published_at: data.publishedAt || undefined,
  }
}
