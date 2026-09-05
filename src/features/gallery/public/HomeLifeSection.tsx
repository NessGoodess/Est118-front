"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { PhotoGalleryBlock } from "@/features/media"
import type { GalleryAlbum } from "@/features/gallery/types/gallery"
import type { PublicEvent } from "@/features/events/types/event"
import { eventDateBadge, eventTypeIcon } from "@/features/events/lib/event-display"

type Props = {
  albums: GalleryAlbum[]
  upcoming: PublicEvent[]
}

export default function HomeLifeSection({ albums, upcoming }: Props) {
  const album = albums[0]
  const photos = album?.photos ?? []

  return (
    <section
      id="vida"
      aria-labelledby="life-heading"
      className="relative scroll-mt-[var(--public-header-h-compact)] overflow-hidden bg-surface-muted py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="life-heading"
              className="mb-4 font-merriweather text-4xl font-bold text-foreground md:text-5xl"
            >
              Vida en la <span className="text-primary">técnica</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 bg-accent-gold" />
            <p className="mx-auto max-w-2xl text-fg-muted">
              Talleres, ceremonias y el día a día de la Escuela Secundaria Técnica No. 118.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {album && photos.length > 0 ? (
            <div>
              <PhotoGalleryBlock
                photos={photos}
                layout="carousel"
                title={album.title}
                caption={album.description}
                albumHref={`/galeria/${album.slug || album.id}`}
              />
              <p className="mt-3 text-center text-sm text-fg-muted">
                {album.category}
                {album.photosCount ? ` · ${album.photosCount} fotos` : ""}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface-elevated px-6 py-16 text-center text-fg-muted">
              Pronto compartiremos fotos de talleres y actividades.
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-merriweather text-xl font-bold text-foreground">
              Próximas actividades
            </h3>

            {upcoming.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface-elevated p-6 text-sm text-fg-muted">
                No hay eventos próximos publicados. Consulta el{" "}
                <Link href="/calendar" className="font-semibold text-primary hover:underline">
                  calendario escolar
                </Link>
                .
              </p>
            ) : (
              <ul className="flex list-none flex-col gap-3 p-0">
                {upcoming.map((event) => {
                  const badge = eventDateBadge(event)
                  return (
                    <li key={event.id}>
                      <Link
                        href={`/eventos/${event.slug || event.id}`}
                        className="flex gap-4 rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex min-w-[56px] flex-col items-center rounded-lg bg-accent-gold px-2 py-1.5 text-brand-950">
                          <span className="font-mono text-xl font-bold leading-tight">
                            {badge.day}
                          </span>
                          <span className="text-[10px] font-bold">{badge.month}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                            <IconByName name={eventTypeIcon(event.type)} className="h-3 w-3" />
                            {event.type}
                          </p>
                          <p className="mt-0.5 font-merriweather font-bold leading-snug text-foreground">
                            {event.title}
                          </p>
                          {event.location ? (
                            <p className="mt-1 truncate text-xs text-fg-muted">{event.location}</p>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary-soft hover:text-primary"
              >
                Ver galería
              </Link>
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Ver eventos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
