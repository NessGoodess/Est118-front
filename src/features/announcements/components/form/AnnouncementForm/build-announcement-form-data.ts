import {
  alertLabelFromForm,
  headerFromType,
  shouldShowAlertBadge,
  type PublishAction,
} from "@/features/announcements/lib/announcement-display"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"

/** Builds multipart FormData for create/update announcement API. */
export function buildAnnouncementFormData(
  data: AnnouncementFormValues,
  publishAction: PublishAction = "publish"
): FormData {
  const fd = new FormData()

  fd.append("title", data.title)
  fd.append("header", headerFromType(data.type))
  if (data.slug) fd.append("slug", data.slug)

  const alertEnabled = shouldShowAlertBadge(data.type)
  fd.append("header_alert_enabled", alertEnabled ? "1" : "0")
  if (alertEnabled) {
    fd.append("header_alert_label", alertLabelFromForm(data.type, data.headerAlertLabel))
  }

  fd.append("secondary_button_enabled", data.secondaryButtonEnabled ? "1" : "0")
  if (data.secondaryButtonLabel) fd.append("secondary_button_label", data.secondaryButtonLabel)
  if (data.secondaryButtonHref) fd.append("secondary_button_href", data.secondaryButtonHref)

  fd.append("media_type", data.mediaType)

  if (data.mediaType === "facebook") {
    fd.append("media_alt", data.mediaAlt?.trim() || "Publicación de Facebook")
    fd.append("media_ratio", data.mediaRatio || "4/3")
    fd.append("media_position", data.mediaPosition || "right")
    fd.append("facebook_post_url", data.facebookPostUrl?.trim() ?? "")
    fd.append("summary", data.summary?.trim() || data.title.trim())
  } else {
    fd.append("media_alt", data.mediaAlt ?? "")
    fd.append("media_ratio", data.mediaRatio || "4/3")
    fd.append("media_position", data.mediaPosition || "right")
    fd.append("facebook_post_url", "")
    fd.append("summary", data.summary ?? "")

    if (data.mediaType === "youtube" && data.mediaYoutubeId) {
      fd.append("media_youtube_id", data.mediaYoutubeId)
    } else if (data.mediaFile instanceof File) {
      fd.append("media_file", data.mediaFile)
    } else if (data.mediaVideoUrl?.trim()) {
      fd.append("media_src", data.mediaVideoUrl.trim())
    } else if (data.existingMediaSrc?.trim()) {
      // Reuse server URL when editing/duplicating without re-uploading
      fd.append("media_src", data.existingMediaSrc.trim())
    }
  }

  if (data.publishedAt) fd.append("published_at", data.publishedAt)
  if (data.author) fd.append("author", data.author)
  fd.append("type", data.type)
  fd.append("important", data.important ? "1" : "0")
  fd.append("publish_action", publishAction)

  const blocks = (data.contentBlocks ?? [])
    .map((block) => {
      if (block.type === "list") {
        return {
          ...block,
          items: block.items.map((i) => i.trim()).filter(Boolean),
        }
      }
      if (block.type === "gallery") {
        return {
          ...block,
          images: block.images
            .filter((image) => image.src.trim())
            .map((image) => ({
              src: image.src.trim(),
              alt: image.alt.trim() || "Fotografía del aviso",
              caption: image.caption?.trim() || undefined,
            })),
        }
      }
      return block
    })
    .filter((block) => {
      if (block.type === "paragraph") return Boolean(block.text.trim())
      if (block.type === "list") return block.items.length > 0
      if (block.type === "image") return Boolean(block.src.trim() && block.alt.trim())
      if (block.type === "youtube") return Boolean(block.youtubeId.trim())
      if (block.type === "video") return Boolean(block.src.trim())
      if (block.type === "gallery") return block.images.length > 0
      if (block.type === "gallery_ref") return block.galleryId > 0
      return false
    })

  fd.append("content_blocks", JSON.stringify(blocks))

  return fd
}
