"use client"

import { useState } from "react"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import PhotoCarousel from "./PhotoCarousel"
import PhotoGrid from "./PhotoGrid"
import PhotoLightbox from "./PhotoLightbox"
import type { PhotoItem, PhotoLayout } from "./types"

type Props = {
  photos: PhotoItem[]
  layout?: PhotoLayout
  title?: string
  caption?: string
  /** Link to the full album when the photos come from the gallery CMS */
  albumHref?: string
}

/**
 * Renders a set of photos as a carousel or a grid, with a shared lightbox.
 * Used by announcement gallery blocks and gallery albums.
 */
export default function PhotoGalleryBlock({
  photos,
  layout = "carousel",
  title,
  caption,
  albumHref,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const usable = photos.filter((photo) => photo.src?.trim())

  if (usable.length === 0) return null

  return (
    <section className="my-8" aria-label={title || "Galería de fotos"}>
      {title ? (
        <header className="mb-4 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconByName name="gallery" className="h-4 w-4" />
          </span>
          <h3 className="font-merriweather text-lg font-bold leading-snug text-foreground">
            {title}
          </h3>
          <span className="ml-auto font-mono text-xs text-fg-muted">
            {usable.length} {usable.length === 1 ? "foto" : "fotos"}
          </span>
        </header>
      ) : null}

      {layout === "grid" ? (
        <PhotoGrid photos={usable} onOpen={setOpenIndex} />
      ) : (
        <PhotoCarousel photos={usable} onOpen={setOpenIndex} />
      )}

      {caption ? (
        <p className="mt-3 text-center font-sans text-sm text-fg-muted">{caption}</p>
      ) : null}

      {albumHref ? (
        <p className="mt-4 flex justify-center">
          <Link
            href={albumHref}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-sans text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Ver el álbum completo
            <IconByName name="arrowRight" className="h-3.5 w-3.5" />
          </Link>
        </p>
      ) : null}

      <PhotoLightbox
        photos={usable}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}
