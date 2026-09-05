/** Categories offered by the CMS; mirrors UpsertGalleryRequest::CATEGORIES. */
export const GALLERY_CATEGORIES = [
  "Talleres",
  "Deportes",
  "Ceremonias",
  "Excursiones",
  "Académico",
  "Comunidad",
] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export type GalleryRatio = "4/3" | "3/4" | "1/1" | "16/9"

export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  caption?: string
  ratio: GalleryRatio
}

/** Album shaped for the public site. */
export interface GalleryAlbum {
  id: string
  slug: string
  title: string
  description?: string
  category: GalleryCategory | string
  cover?: string
  featured: boolean
  photosCount: number
  /** Localized publication date, e.g. "4 de septiembre de 2026" */
  date?: string
  publishedAt?: string
  photos: GalleryPhoto[]
}

/** Raw photo row as returned by the API. */
export interface GalleryItemRaw {
  id: number
  gallery_id: number
  media_src: string
  alt: string
  caption?: string | null
  ratio: GalleryRatio
  sort_order: number
}

/** Raw album as returned by the API (items only on detail / admin list). */
export interface GalleryRawItem {
  id: number
  slug: string
  title: string
  description?: string | null
  category: string
  cover_src?: string | null
  featured: boolean
  published_at?: string | null
  created_at: string
  updated_at: string
  items_count?: number
  items?: GalleryItemRaw[]
}

/** Payload accepted by create/update. */
export interface GalleryUpsertPayload {
  title: string
  slug?: string
  description?: string
  category: string
  cover_src?: string
  featured: boolean
  publish_action: "draft" | "publish" | "schedule"
  published_at?: string
  items: Array<{
    media_src: string
    alt: string
    caption?: string
    ratio: GalleryRatio
  }>
}

/** Query params for the public albums list. */
export type PublicGalleriesQuery = {
  category?: string
  featured?: boolean
  limit?: number
}
