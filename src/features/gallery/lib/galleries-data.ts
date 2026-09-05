import { getPublicGalleries, getPublicGallery } from "@/features/gallery/api/public"
import type { GalleryAlbum, GalleryPhoto, GalleryRawItem } from "@/features/gallery/types/gallery"

function formatDateToSpanish(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function mapGalleryFromApi(api: GalleryRawItem): GalleryAlbum {
  const photos: GalleryPhoto[] = (api.items ?? []).map((item) => ({
    id: String(item.id),
    src: item.media_src,
    alt: item.alt,
    caption: item.caption ?? undefined,
    ratio: item.ratio ?? "4/3",
  }))

  return {
    id: String(api.id),
    slug: api.slug,
    title: api.title,
    description: api.description ?? undefined,
    category: api.category,
    cover: api.cover_src ?? photos[0]?.src,
    featured: api.featured,
    photosCount: api.items_count ?? photos.length,
    date: formatDateToSpanish(api.published_at),
    publishedAt: api.published_at ?? undefined,
    photos,
  }
}

/** Published albums for `/galeria`. Never throws: an API outage shows an empty state. */
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const data = await getPublicGalleries()
    return data.map(mapGalleryFromApi)
  } catch {
    return []
  }
}

/** Featured albums with photos (falls back to the most recent ones) for home strips. */
export async function getFeaturedGalleryAlbums(limit = 1): Promise<GalleryAlbum[]> {
  try {
    let listed = await getPublicGalleries({ featured: true, limit })
    if (listed.length === 0) {
      listed = await getPublicGalleries({ limit })
    }

    const details = await Promise.all(
      listed.map((item) => getPublicGallery(String(item.slug || item.id)))
    )

    return details
      .filter((album): album is NonNullable<typeof album> => album !== null)
      .map(mapGalleryFromApi)
  } catch {
    return []
  }
}

export async function getGalleryAlbum(idOrSlug: string): Promise<GalleryAlbum | null> {
  try {
    const data = await getPublicGallery(idOrSlug)
    return data ? mapGalleryFromApi(data) : null
  } catch {
    return null
  }
}
