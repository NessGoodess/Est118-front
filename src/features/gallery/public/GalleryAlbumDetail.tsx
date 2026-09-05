"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import { PhotoGalleryBlock } from "@/features/media"
import type { GalleryAlbum } from "@/features/gallery/types/gallery"

export default function GalleryAlbumDetail({ album }: { album: GalleryAlbum }) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {album.description ? (
          <p className="mx-auto max-w-3xl border-l-4 border-primary/40 pl-5 text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-foreground">
            {album.description}
          </p>
        ) : null}

        <PhotoGalleryBlock photos={album.photos} layout="grid" />

        {album.photos.length > 1 ? (
          <section aria-label="Recorrido en carrusel" className="pt-2">
            <h2 className="mb-4 flex items-center gap-2.5 font-merriweather text-lg font-bold text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconByName name="carousel" className="h-4 w-4" />
              </span>
              Recorre el álbum
            </h2>
            <PhotoGalleryBlock photos={album.photos} layout="carousel" />
          </section>
        ) : null}

        <nav className="border-t border-border pt-6" aria-label="Volver">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            ← Volver a la galería
          </Link>
        </nav>
      </motion.div>
    </article>
  )
}
