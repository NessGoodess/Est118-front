"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { AnnouncementExtended, AnnouncementMedia } from "@/components/public/sections/Announcements/Announcement-extended.types"

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const RATIO_CLASS: Record<NonNullable<AnnouncementMedia["ratio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/4": "aspect-square",
}

const TYPE_STYLES: Record<string, { badge: string; dot: string }> = {
  Informativo: { badge: "bg-blue-500/10 text-blue-600 border-blue-200", dot: "bg-blue-500" },
  Urgente: { badge: "bg-red-500/10 text-red-600 border-red-200", dot: "bg-red-500" },
  Recordatorio: { badge: "bg-amber-500/10 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  Tarea: { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-200", dot: "bg-emerald-500" },
  General: { badge: "bg-gray-500/10 text-gray-600 border-gray-200", dot: "bg-gray-400" },
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function MediaThumb({ media }: { media: AnnouncementMedia }) {
  const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <div className={`relative w-full overflow-hidden ${ratioClass}`}>
        <Image
          src={`https://img.youtube.com/vi/${media.youtubeId}/mqdefault.jpg`}
          alt={media.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          YouTube
        </span>
      </div>
    )
  }

  if (media.type === "video" && media.src) {
    return (
      <div className={`relative w-full overflow-hidden bg-gray-200 ${ratioClass}`}>
        <video src={media.src} className="h-full w-full object-cover" muted />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0d1117] shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg className="h-5 w-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </div>
    )
  }

  if (media.src) {
    return (
      <div className={`relative w-full overflow-hidden ${ratioClass}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    )
  }

  // Fallback placeholder
  return (
    <div className={`relative w-full bg-linear-to-br from-gray-100 to-gray-200 ${ratioClass}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type?: AnnouncementExtended["type"] }) {
  if (!type) return null
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.General
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide ${style.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {type}
    </span>
  )
}

function ImportantBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-500/10 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-red-600">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      Importante
    </span>
  )
}

function CardFooter({ announcement }: { announcement: AnnouncementExtended }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[11px] text-gray-400">
      <div className="flex min-w-0 items-center gap-1.5">
        {announcement.autor && (
          <>
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate font-medium text-gray-500">{announcement.autor}</span>
          </>
        )}
        {announcement.autor && announcement.fecha && (
          <span className="mx-0.5 text-gray-300">·</span>
        )}
        {announcement.fecha && (
          <span className="shrink-0">{announcement.fecha}</span>
        )}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
        Leer más
        <svg className="h-3 w-3 -translate-x-0.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main list component
// ─────────────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" as const },
  }),
}

export default function AnnouncementsList({ Announcements }: { Announcements: AnnouncementExtended[] }) {
  if (!Announcements.length) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-600">Sin avisos disponibles</h3>
        <p className="mt-1 text-sm text-gray-400">No hay comunicados publicados por el momento.</p>
      </section>
    )
  }

  return (
    <section className="px-[clamp(16px,5vw,72px)] pb-[clamp(48px,8vw,96px)]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Link
                href={`/Announcements/${announcement.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d1117]/6 bg-white shadow-[0_4px_24px_rgba(13,17,23,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(13,17,23,0.13)]"
              >
                {/* Media */}
                <MediaThumb media={announcement.media} />

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Badges */}
                  <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                    <TypeBadge type={announcement.type} />
                    {announcement.importante && <ImportantBadge />}
                  </div>

                  {/* Header label */}
                  {announcement.header && (
                    <p className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-blue-600">
                      {announcement.header}
                    </p>
                  )}

                  {/* Title */}
                  <h2 className="font-[Syne,sans-serif] text-[1.05rem] font-extrabold leading-snug tracking-tight text-[#0d1117] line-clamp-2 transition-colors duration-200 group-hover:text-blue-700">
                    {announcement.title}
                  </h2>

                  {/* Accent rule */}
                  <span className="mt-2 block h-[2px] w-8 rounded-full bg-red-500" />

                  {/* Extended content */}
                  <div className="mt-3 flex-1 text-[13px] font-light leading-relaxed text-gray-500">
                    {announcement.content.type === "text" ? (
                      <p className="whitespace-pre-wrap">{announcement.content.text}</p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1">
                        {announcement.content.items?.map((item, i) => (
                          <li key={i} className="line-clamp-2">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer */}
                  <CardFooter announcement={announcement} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
