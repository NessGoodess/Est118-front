import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"

/** API payload shape used when loading an announcement for edit. */
export type AnnouncementResponse = {
  title: string
  slug?: string | null
  header_alert_enabled: boolean
  header_alert_label?: string | null
  secondary_button_enabled: boolean
  secondary_button_label?: string | null
  secondary_button_href?: string | null
  media_type: "image" | "video" | "youtube" | "facebook"
  media_alt?: string | null
  media_ratio?: "4/3" | "3/4" | "4/4"
  media_position?: "left" | "right" | null
  media_src?: string | null
  media_youtube_id?: string | null
  published_at?: string | null
  author?: string | null
  type: string
  important: boolean
  summary?: string | null
  content_blocks?: AnnouncementContentBlock[] | null
  facebook_post_url?: string | null
}

export function mapAnnouncementToFormValues(
  data: AnnouncementResponse
): AnnouncementFormValues {
  const mediaSrc = data.media_src?.trim() || ""
  const isExternalVideoUrl =
    data.media_type === "video" &&
    mediaSrc.startsWith("http") &&
    !mediaSrc.includes("/storage/announcements/")

  return {
    title: data.title,
    slug: data.slug || "",
    headerAlertLabel: data.header_alert_label || "Aviso urgente",
    secondaryButtonEnabled: Boolean(data.secondary_button_enabled),
    secondaryButtonLabel: data.secondary_button_label || "",
    secondaryButtonHref: data.secondary_button_href || "",
    mediaType: data.media_type || "image",
    mediaAlt: data.media_alt || "",
    mediaRatio: data.media_ratio || "4/3",
    mediaPosition: data.media_position || "right",
    mediaYoutubeId: data.media_youtube_id || "",
    publishedAt: data.published_at ? data.published_at.substring(0, 16) : "",
    author: data.author || "",
    type: (data.type as AnnouncementFormValues["type"]) || "General",
    important: Boolean(data.important),
    summary: data.summary || "",
    facebookPostUrl: data.facebook_post_url || "",
    contentBlocks: Array.isArray(data.content_blocks) ? data.content_blocks : [],
    existingMediaSrc: mediaSrc,
    mediaVideoUrl: isExternalVideoUrl ? mediaSrc : "",
    mediaFile: null,
  }
}
