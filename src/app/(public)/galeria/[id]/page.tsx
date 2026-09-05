import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BrandPageHero } from "@/features/announcements"
import { GalleryAlbumDetail, getGalleryAlbum } from "@/features/gallery"
import { getSiteUrl } from "@/lib/site"

export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const album = await getGalleryAlbum(id)
  if (!album) {
    return { title: "Álbum no encontrado" }
  }

  const description =
    album.description ||
    `${album.photosCount} fotografías de ${album.category.toLowerCase()} en la EST 118.`
  const url = `${getSiteUrl()}/galeria/${album.slug || album.id}`
  const image = album.cover ?? `${getSiteUrl()}/background4.png`

  return {
    title: album.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: album.title,
      description,
      siteName: "EST 118",
      locale: "es_MX",
      images: [{ url: image, alt: album.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: album.title,
      description,
      images: [image],
    },
  }
}

export default async function GaleriaAlbumPage({ params }: PageProps) {
  const { id } = await params
  const album = await getGalleryAlbum(id)
  if (!album) notFound()

  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        size="md"
        eyebrow="Galería"
        title={album.title}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-public-glass-border bg-public-glass px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase text-public-on-media">
              {album.category}
            </span>
            <span className="font-mono text-[11px] text-public-on-media/80">
              {album.photosCount} {album.photosCount === 1 ? "foto" : "fotos"}
              {album.date ? ` · ${album.date}` : ""}
            </span>
          </div>
        }
      />
      <GalleryAlbumDetail album={album} />
    </div>
  )
}
