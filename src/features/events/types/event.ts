import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement"

/** Mirrors App\Models\Content\Event::TYPES. */
export const EVENT_TYPES = [
  "Ceremonia",
  "Feria",
  "Torneo",
  "Examen",
  "Cultural",
  "Deportivo",
  "Académico",
  "Junta",
  "Entrega",
  "Suspensión",
  "Vacaciones",
] as const

export type EventType = (typeof EVENT_TYPES)[number]

/** Event shaped for the public site. */
export interface PublicEvent {
  id: string
  slug: string
  title: string
  type: EventType | string
  summary?: string
  location?: string
  cover?: string
  important: boolean
  galleryId?: number
  startsAt: string
  endsAt?: string
  dateLabel: string
  timeLabel?: string
  contentBlocks: AnnouncementContentBlock[]
}

/** Raw event as returned by the API. */
export interface EventRawItem {
  id: number
  slug: string
  title: string
  type: string
  summary?: string | null
  content_blocks?: AnnouncementContentBlock[] | null
  starts_at: string
  ends_at?: string | null
  location?: string | null
  cover_src?: string | null
  important: boolean
  gallery_id?: number | null
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface EventUpsertPayload {
  title: string
  slug?: string
  type: string
  summary?: string
  content_blocks: AnnouncementContentBlock[]
  starts_at: string
  ends_at?: string
  location?: string
  cover_src?: string
  important: boolean
  gallery_id?: number | null
  publish_action: "draft" | "publish" | "schedule"
  published_at?: string
}

/** Query params for the public events list. */
export type PublicEventsQuery = {
  upcoming?: boolean
  from?: string
  to?: string
  limit?: number
}
