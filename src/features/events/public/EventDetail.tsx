"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import ContentBlocks from "@/features/announcements/public/ContentBlocks"
import type { PublicEvent } from "@/features/events/types/event"
import { eventRangeLabel, eventTypeIcon } from "@/features/events/lib/event-display"

export default function EventDetail({ event }: { event: PublicEvent }) {
  const range = eventRangeLabel(event)

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl"
      >
        {event.cover ? (
          <div className="relative h-72 md:h-[420px]">
            <AnnouncementMediaImageFill
              src={event.cover}
              alt={event.title}
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="p-8 md:p-12">
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-primary-soft p-4">
              <p className="mb-1 text-xs text-fg-muted">Fecha</p>
              <p className="font-semibold text-foreground">{range ?? event.dateLabel}</p>
            </div>
            <div className="rounded-lg bg-primary-soft p-4">
              <p className="mb-1 text-xs text-fg-muted">Hora</p>
              <p className="font-semibold text-foreground">{event.timeLabel ?? "Por confirmar"}</p>
            </div>
            <div className="rounded-lg bg-primary-soft p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs text-fg-muted">
                <IconByName name={eventTypeIcon(event.type)} className="h-3.5 w-3.5" />
                Lugar
              </p>
              <p className="font-semibold text-foreground">{event.location ?? "Por confirmar"}</p>
            </div>
          </div>

          {event.summary ? (
            <p className="mb-6 text-lg font-semibold leading-relaxed text-foreground">
              {event.summary}
            </p>
          ) : null}

          <ContentBlocks blocks={event.contentBlocks} />

          <nav className="mt-8 border-t border-border pt-8" aria-label="Volver">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              ← Volver a los eventos
            </Link>
          </nav>
        </div>
      </motion.div>
    </article>
  )
}
