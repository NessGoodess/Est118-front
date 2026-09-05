import type { AnnouncementExtended } from "@/features/announcements/types/announcement"
import { hydrateGalleryRefs } from "@/features/gallery/lib/hydrate-gallery-refs"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"
import {
  headerFromType,
  shouldShowAlertBadge,
} from "@/features/announcements/lib/announcement-display"
import {
  getPublicAnnouncements,
  type AnnouncementRawItem,
} from "@/features/announcements/services/announcements.service"

function formatDateToSpanish(dateString: string | null | undefined): string | undefined {
  if (!dateString) return undefined
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function mapAnnouncementFromApi(api: AnnouncementRawItem): AnnouncementExtended {
  const type = (api.type as AnnouncementExtended["type"]) ?? "General"
  const alertEnabled = shouldShowAlertBadge(type as AnnouncementFormValues["type"]) && api.header_alert_enabled

  return {
    id: String(api.id),
    slug: api.slug ?? "",
    headerAlert: alertEnabled
      ? {
          enabled: true,
          label: api.header_alert_label ?? "Aviso urgente",
        }
      : undefined,
    header: api.header?.trim() || headerFromType(type as AnnouncementFormValues["type"]),
    title: api.title,
    content: {
      type: "text",
      text: api.summary ?? api.content_text ?? "",
    },
    secondaryButton: {
      enabled: api.secondary_button_enabled,
      label: api.secondary_button_label ?? "",
      href: api.secondary_button_href ?? "",
    },
    media: {
      type: api.media_type,
      src: api.media_src ?? undefined,
      youtubeId: api.media_youtube_id ?? undefined,
      facebookPostUrl:
        api.media_type === "facebook"
          ? api.facebook_post_url?.trim() || undefined
          : undefined,
      alt: api.media_alt,
      ratio: api.media_ratio,
      position: api.media_position ?? "right",
    },
    fecha: formatDateToSpanish(api.published_at),
    autor: api.author ?? undefined,
    type,
    importante: api.important,
    resumen: api.summary ?? undefined,
    contentBlocks: api.content_blocks ?? [],
    facebookPostUrl:
      api.media_type === "facebook"
        ? api.facebook_post_url?.trim() || null
        : null,
  }
}

/** All published announcements from the API (no FE mocks). */
export async function getAnnouncementsExtended(): Promise<AnnouncementExtended[]> {
  try {
    const data = await getPublicAnnouncements()
    return data.map(mapAnnouncementFromApi)
  } catch {
    return []
  }
}

/**
 * Home feed: prioritizes `important`, then keeps API order (published_at desc), capped.
 */
export async function getHomeAnnouncements(
  limit = 5
): Promise<AnnouncementExtended[]> {
  const all = await getAnnouncementsExtended()
  const ranked = [...all].sort((a, b) => {
    const byImportant = Number(b.importante) - Number(a.importante)
    if (byImportant !== 0) return byImportant
    return 0
  })
  return ranked.slice(0, Math.max(0, limit))
}

export async function getAnnouncementExtendedByIdOrSlug(
  idOrSlug: string
): Promise<AnnouncementExtended | null> {
  const all = await getAnnouncementsExtended()
  const announcement = all.find((a) => a.id === idOrSlug || a.slug === idOrSlug)
  if (!announcement) return null

  return {
    ...announcement,
    contentBlocks: await hydrateGalleryRefs(announcement.contentBlocks),
  }
}
