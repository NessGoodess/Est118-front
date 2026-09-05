import type { Metadata } from "next"
import { BrandPageHero } from "@/features/announcements"
import { GalleryAlbumsList, getGalleryAlbums } from "@/features/gallery"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Fotografías de talleres, ceremonias, deportes y actividades de la comunidad de la Escuela Secundaria Técnica 118.",
}

export default async function GaleriaPage() {
  const albums = await getGalleryAlbums()

  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        title="Galería"
        description="Momentos destacados de nuestra comunidad escolar"
      />
      <GalleryAlbumsList albums={albums} />
    </div>
  )
}
