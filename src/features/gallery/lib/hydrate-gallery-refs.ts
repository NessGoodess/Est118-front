import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement"
import { getPublicGallery } from "@/features/gallery/api/public"
import type { GalleryRawItem } from "@/features/gallery/types/gallery"

/**
 * Replaces `gallery_ref` blocks with real `gallery` blocks so server-rendered
 * details show the album photos without a client-side round trip.
 * Blocks pointing at a missing or unpublished album are dropped.
 */
export async function hydrateGalleryRefs(
  blocks: AnnouncementContentBlock[]
): Promise<AnnouncementContentBlock[]> {
  const refIds = blocks
    .filter((block) => block.type === "gallery_ref")
    .map((block) => block.galleryId)

  if (refIds.length === 0) return blocks

  const albums = new Map<number, GalleryRawItem>()
  await Promise.all(
    Array.from(new Set(refIds)).map(async (id) => {
      try {
        const album = await getPublicGallery(String(id))
        if (album) albums.set(id, album)
      } catch {
        // Ignored: the block is dropped below.
      }
    })
  )

  return blocks.flatMap((block): AnnouncementContentBlock[] => {
    if (block.type !== "gallery_ref") return [block]

    const album = albums.get(block.galleryId)
    if (!album?.items?.length) return []

    return [
      {
        type: "gallery",
        layout: block.layout,
        title: block.title || album.title,
        caption: album.description ?? undefined,
        albumHref: `/galeria/${album.slug || album.id}`,
        images: album.items.map((item) => ({
          src: item.media_src,
          alt: item.alt,
          caption: item.caption ?? undefined,
        })),
      },
    ]
  })
}
