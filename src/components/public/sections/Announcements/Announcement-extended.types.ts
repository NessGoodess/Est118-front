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

/** Media: image URL, video URL (backend) or YouTube ID */
export type AnnouncementMediaType = "image" | "video" | "youtube"

export interface AnnouncementMedia {
  type: AnnouncementMediaType
  /** URL of image or video (backend); unused if type === "youtube" */
  src?: string
  /** YouTube video ID (e.g. "dQw4w9WgXcQ"); only if type === "youtube" */
  youtubeId?: string
  alt: string
  /** Aspect ratio for image/video: "4/3" | "3/4" | "4/4" */
  ratio?: "4/3" | "3/4" | "4/4"
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
  /** For listing and detail */
  fecha?: string
  autor?: string
  type?: "Informativo" | "Urgente" | "Recordatorio" | "Tarea" | "General"
  importante?: boolean
}

/** Extended content blocks for the detail page */
export type AnnouncementContentBlockType = "paragraph" | "list" | "image" | "video" | "youtube"

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

export type AnnouncementContentBlock =
  | AnnouncementContentBlockParagraph
  | AnnouncementContentBlockList
  | AnnouncementContentBlockImage
  | AnnouncementContentBlockVideo
  | AnnouncementContentBlockYoutube

/** Extended notice for the detail page */
export interface AnnouncementExtended extends AnnouncementCardData {
  /** Short summary for meta and listing */
  resumen?: string
  /** Extended content blocks (paragraphs, lists, images, videos, YouTube) */
  contentBlocks: AnnouncementContentBlock[]
}
