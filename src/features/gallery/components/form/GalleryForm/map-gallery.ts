import type { PublishAction } from "@/features/announcements/lib/announcement-display"
import type { GalleryFormValues } from "@/features/gallery/validations/gallery.schema"
import { GALLERY_FORM_DEFAULTS } from "@/features/gallery/validations/gallery.schema"
import {
  GALLERY_CATEGORIES,
  type GalleryRawItem,
  type GalleryUpsertPayload,
} from "@/features/gallery/types/gallery"

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

export function mapGalleryToFormValues(api: GalleryRawItem): GalleryFormValues {
  const category = GALLERY_CATEGORIES.includes(
    api.category as (typeof GALLERY_CATEGORIES)[number]
  )
    ? (api.category as GalleryFormValues["category"])
    : GALLERY_FORM_DEFAULTS.category

  return {
    title: api.title,
    slug: api.slug ?? "",
    description: api.description ?? "",
    category,
    coverSrc: api.cover_src ?? "",
    featured: api.featured,
    publishedAt: toDateTimeLocal(api.published_at),
    photos: (api.items ?? []).map((item) => ({
      src: item.media_src,
      alt: item.alt,
      caption: item.caption ?? "",
      ratio: item.ratio ?? "4/3",
    })),
  }
}

export function buildGalleryPayload(
  data: GalleryFormValues,
  publishAction: PublishAction
): GalleryUpsertPayload {
  return {
    title: data.title.trim(),
    slug: data.slug?.trim() || undefined,
    description: data.description?.trim() || undefined,
    category: data.category,
    cover_src: data.coverSrc?.trim() || data.photos[0]?.src,
    featured: data.featured,
    publish_action: publishAction,
    published_at: data.publishedAt || undefined,
    items: data.photos.map((photo) => ({
      media_src: photo.src,
      alt: photo.alt.trim(),
      caption: photo.caption?.trim() || undefined,
      ratio: photo.ratio,
    })),
  }
}
