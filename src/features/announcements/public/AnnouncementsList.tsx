"use client"

import Image from "next/image"
import Link from "next/link"
import { cardDisplayText } from "@/features/announcements/lib/announcement-display"
import { AnnouncementListCardMediaImage } from "@/features/announcements/shared/AnnouncementMediaImage"
import { motion } from "framer-motion"
import type { AnnouncementExtended, AnnouncementMedia } from "@/features/announcements/types/announcement"
import { IconByName } from "@/components/ui/icons"
import FacebookMediaPlaceholder from "@/features/announcements/shared/FacebookMediaPlaceholder"

const TYPE_STYLES: Record<string, { badge: string; dot: string }> = {
  Informativo: { badge: "bg-primary-soft0/10 text-primary border-border", dot: "bg-primary-soft0" },
  Urgente: { badge: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  Recordatorio: { badge: "bg-amber-500/10 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  Tarea: { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-200", dot: "bg-emerald-500" },
  General: { badge: "bg-surface-muted0/10 text-fg-muted border-border", dot: "bg-fg-muted" },
}

/** List cards: fixed height so the grid stays even. */
const CARD_MEDIA_FRAME =
  "relative h-[200px] w-full overflow-hidden sm:h-[220px] md:h-[240px]"

const CARD_MEDIA_COVER =
  "object-cover transition-transform duration-500 group-hover:scale-105"

function MediaThumb({ media }: { media: AnnouncementMedia }) {
  if (media.type === "facebook") {
    return (
      <figure className={CARD_MEDIA_FRAME}>
        <FacebookMediaPlaceholder className="absolute inset-0" />
        <figcaption className="sr-only">{media.alt || "Facebook"}</figcaption>
      </figure>
    )
  }

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <figure className={CARD_MEDIA_FRAME}>
        <Image
          src={`https://img.youtube.com/vi/${media.youtubeId}/mqdefault.jpg`}
          alt={media.alt}
          fill
          className={CARD_MEDIA_COVER}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/90 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <IconByName name="play" className="h-5 w-5 translate-x-0.5 text-white" />
          </span>
        </div>
        <figcaption className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          YouTube
        </figcaption>
      </figure>
    )
  }

  if (media.type === "video" && media.src) {
    return (
      <figure className={CARD_MEDIA_FRAME}>
        <video src={media.src} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated/90 text-foreground shadow-lg transition-transform duration-200 group-hover:scale-110">
            <IconByName name="play" className="h-5 w-5 translate-x-0.5" />
          </span>
        </div>
      </figure>
    )
  }

  if (media.src) {
    return (
      <figure className={CARD_MEDIA_FRAME}>
        <AnnouncementListCardMediaImage src={media.src} alt={media.alt} />
      </figure>
    )
  }

  return (
    <figure
      className={`flex items-center justify-center bg-linear-to-br from-surface-muted to-loading-base ${CARD_MEDIA_FRAME}`}
    >
      <IconByName name="image" className="h-10 w-10 text-fg-muted" aria-hidden />
      <figcaption className="sr-only">Sin imagen</figcaption>
    </figure>
  )
}

function TypeBadge({ type }: { type?: AnnouncementExtended["type"] }) {
  if (!type) return null
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.General
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
      {type}
    </span>
  )
}

function ImportantBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-danger"
      role="status"
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
      </span>
      Importante
    </span>
  )
}

function CardFooter({ announcement }: { announcement: AnnouncementExtended }) {
  return (
    <footer className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3 text-[11px] text-fg-muted">
      <p className="flex min-w-0 items-center gap-1.5">
        {announcement.autor && (
          <>
            <IconByName name="user" className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate font-medium text-fg-muted">{announcement.autor}</span>
          </>
        )}
        {announcement.autor && announcement.fecha && (
          <span className="mx-0.5 text-fg-muted" aria-hidden>
            ·
          </span>
        )}
        {announcement.fecha && <time dateTime={announcement.fecha}>{announcement.fecha}</time>}
      </p>
      <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary transition-colors group-hover:text-primary-hover">
        Leer más
        <IconByName
          name="chevronRight"
          className="h-3 w-3 -translate-x-0.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </footer>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" as const },
  }),
}

export default function AnnouncementsList({
  Announcements,
}: {
  Announcements: AnnouncementExtended[]
}) {
  if (!Announcements.length) {
    return (
      <section
        className="flex flex-col items-center justify-center py-24 text-center"
        aria-labelledby="announcements-empty-heading"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted" aria-hidden>
          <IconByName name="megaphone" className="h-8 w-8 text-fg-muted" />
        </div>
        <h2 id="announcements-empty-heading" className="text-base font-semibold text-fg-muted">
          Sin avisos disponibles
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          No hay comunicados publicados por el momento.
        </p>
      </section>
    )
  }

  return (
    <section
      className="px-[clamp(16px,5vw,72px)] pt-[clamp(24px,4vw,40px)] pb-[clamp(48px,8vw,96px)]"
      aria-label="Listado de avisos y noticias"
    >
      <ul className="mx-auto grid max-w-7xl list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {Announcements.map((announcement, index) => (
          <motion.li
            key={announcement.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="h-full"
          >
            <article className="h-full">
              <Link
                href={`/Announcements/${announcement.slug || announcement.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/6 bg-surface-elevated shadow-[0_4px_24px_rgba(13,17,23,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(13,17,23,0.13)]"
              >
                <MediaThumb media={announcement.media} />

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                    <TypeBadge type={announcement.type} />
                    {announcement.importante && <ImportantBadge />}
                  </div>

                  <header>
                    {announcement.header && (
                      <p className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                        {announcement.header}
                      </p>
                    )}
                    <h2 className="font-merriweather text-[1.05rem] font-extrabold leading-snug tracking-tight text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-primary-hover">
                      {announcement.title}
                    </h2>
                    <span className="mt-2 block h-[2px] w-8 rounded-full bg-danger" aria-hidden />
                  </header>

                  <div className="mt-3 flex-1 text-[13px] font-light leading-relaxed text-fg-muted">
                    {cardDisplayText(announcement) ? (
                      <p className="line-clamp-3 whitespace-pre-wrap">
                        {cardDisplayText(announcement)}
                      </p>
                    ) : null}
                  </div>

                  <CardFooter announcement={announcement} />
                </div>
              </Link>
            </article>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
