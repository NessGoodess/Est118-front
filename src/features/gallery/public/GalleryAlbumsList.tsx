"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import type { GalleryAlbum } from "@/features/gallery/types/gallery"

const ALL = "Todos"

export default function GalleryAlbumsList({ albums }: { albums: GalleryAlbum[] }) {
  const [category, setCategory] = useState(ALL)

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(albums.map((album) => album.category)))],
    [albums]
  )

  const filtered = useMemo(
    () => (category === ALL ? albums : albums.filter((a) => a.category === category)),
    [albums, category]
  )

  if (albums.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconByName name="gallery" className="h-7 w-7" />
        </span>
        <h2 className="font-merriweather text-2xl font-bold text-foreground">
          Todavía no hay álbumes publicados
        </h2>
        <p className="mt-2 text-fg-muted">
          Pronto compartiremos las fotos de talleres, ceremonias y actividades de la escuela.
        </p>
      </section>
    )
  }

  return (
    <>
      {categories.length > 2 ? (
        <nav
          aria-label="Categorías de la galería"
          className="sticky top-[var(--public-sticky-top)] z-40 border-b border-border bg-surface-elevated/95 shadow-sm backdrop-blur-md transition-[top] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {categories.map((item) => (
              <motion.button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  category === item
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface-muted text-foreground hover:bg-primary-soft"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </nav>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.ul
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((album, index) => (
              <motion.li
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
              >
                <Link
                  href={`/galeria/${album.slug || album.id}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-md transition-shadow duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-brand-950/90">
                    {album.cover ? (
                      <AnnouncementMediaImageFill
                        src={album.cover}
                        alt={album.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-public-on-media-muted">
                        <IconByName name="gallery" className="h-10 w-10" />
                      </span>
                    )}

                    <div
                      className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/10 to-transparent"
                      aria-hidden
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <span className="rounded-full bg-accent-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-950">
                        {album.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-950/60 px-2.5 py-0.5 font-mono text-[11px] text-public-on-media">
                        <IconByName name="image" className="h-3 w-3" />
                        {album.photosCount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 p-5">
                    <h2 className="font-merriweather text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {album.title}
                    </h2>
                    {album.description ? (
                      <p className="line-clamp-2 text-sm leading-relaxed text-fg-muted">
                        {album.description}
                      </p>
                    ) : null}
                    <p className="flex items-center gap-2 border-t border-border pt-3 text-xs text-fg-muted">
                      {album.date ? <span>{album.date}</span> : null}
                      <span className="ml-auto inline-flex items-center gap-1 font-medium text-primary">
                        Ver álbum
                        <IconByName name="arrowRight" className="h-3 w-3" />
                      </span>
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-lg text-fg-muted">
            No hay álbumes en esta categoría.
          </p>
        ) : null}
      </section>
    </>
  )
}
