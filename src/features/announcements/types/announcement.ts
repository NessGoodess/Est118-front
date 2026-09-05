/**
 * Types for the Notices/Announcements (Announcements) Hero system.
 * Supports media: image (backend), video (backend), or YouTube.
 */

export type AnnouncementContentType = "text" | "list"

export interface AnnouncementCardContent {
  type: AnnouncementContentType
  text?: string | null
  items?: string[]
}


export interface AnnouncementCardSecondaryButton {
  enabled: boolean
  label: string
  href: string
}

/** Media: image URL, video URL (backend), YouTube ID, or Facebook post */
export type AnnouncementMediaType = "image" | "video" | "youtube" | "facebook"

export interface AnnouncementMedia {
  type: AnnouncementMediaType
  src?: string
  youtubeId?: string
  facebookPostUrl?: string
  alt: string
  ratio?: "4/3" | "3/4" | "4/4"
  position?: "left" | "right"
}

/** Card data for the notices section (carousel) and list */
export interface AnnouncementCardData {
  id: string
  slug: string
  headerAlert?: {
    enabled: boolean
    label?: string
  }
  header: string
  title: string
  content: AnnouncementCardContent
  secondaryButton?: AnnouncementCardSecondaryButton
  media: AnnouncementMedia
  fecha?: string
  autor?: string
  type?: "Informativo" | "Urgente" | "Recordatorio" | "Tarea" | "General" | "Noticia"
  importante?: boolean
  resumen?: string
}

/** Extended content blocks for the detail page */
export type AnnouncementContentBlockType =
  | "paragraph"
  | "list"
  | "image"
  | "video"
  | "youtube"
  | "gallery"
  | "gallery_ref"

export interface AnnouncementContentBlockParagraph {
  type: "paragraph"
  text: string
}

export interface AnnouncementContentBlockList {
  type: "list"
  items: string[]
}

export interface AnnouncementContentBlockImage {
  type: "image"
  src: string
  alt: string
  caption?: string
}

export interface AnnouncementContentBlockVideo {
  type: "video"
  src: string
  caption?: string
}

export interface AnnouncementContentBlockYoutube {
  type: "youtube"
  youtubeId: string
  caption?: string
}

/** Layout used to render a set of photos inside a notice */
export type AnnouncementGalleryLayout = "carousel" | "grid"

export interface AnnouncementGalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface AnnouncementContentBlockGallery {
  type: "gallery"
  images: AnnouncementGalleryImage[]
  layout: AnnouncementGalleryLayout
  title?: string
  caption?: string
  /** Set when the block was hydrated from a linked album */
  albumHref?: string
}

/**
 * Reference to an existing album. Hydrated into a `gallery` block server-side
 * so the public detail always renders real photos.
 */
export interface AnnouncementContentBlockGalleryRef {
  type: "gallery_ref"
  galleryId: number
  layout: AnnouncementGalleryLayout
  title?: string
}

export type AnnouncementContentBlock =
  | AnnouncementContentBlockParagraph
  | AnnouncementContentBlockList
  | AnnouncementContentBlockImage
  | AnnouncementContentBlockVideo
  | AnnouncementContentBlockYoutube
  | AnnouncementContentBlockGallery
  | AnnouncementContentBlockGalleryRef

/** Extended notice for the detail page */
export interface AnnouncementExtended extends AnnouncementCardData {
  contentBlocks: AnnouncementContentBlock[]
  facebookPostUrl?: string | null
}
