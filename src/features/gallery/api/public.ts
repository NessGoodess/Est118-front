import { API_ENDPOINTS, buildApiUrl } from "@/lib/api"
import type { GalleryRawItem, PublicGalleriesQuery } from "@/features/gallery/types/gallery"

/** Published albums (fetch so Next.js can cache the response). */
export async function getPublicGalleries(
  query: PublicGalleriesQuery = {}
): Promise<GalleryRawItem[]> {
  const params = new URLSearchParams()
  if (query.category) params.set("category", query.category)
  if (query.featured) params.set("featured", "1")
  if (query.limit) params.set("limit", String(query.limit))

  const search = params.toString()
  const url = `${buildApiUrl(API_ENDPOINTS.GALLERIES.GET_ALL)}${search ? `?${search}` : ""}`

  const response = await fetch(url, { next: { revalidate: 60 } })

  if (!response.ok) {
    throw new Error("Failed to fetch public galleries")
  }

  return response.json()
}

/** Single published album by id or slug. */
export async function getPublicGallery(
  idOrSlug: string
): Promise<GalleryRawItem | null> {
  const response = await fetch(
    buildApiUrl(API_ENDPOINTS.GALLERIES.GET_ONE(idOrSlug)),
    { next: { revalidate: 60 } }
  )

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("Failed to fetch public gallery")
  }

  return response.json()
}
