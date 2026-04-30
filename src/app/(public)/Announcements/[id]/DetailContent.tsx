"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type {
  AnnouncementExtended,
  AnnouncementContentBlock,
} from "@/components/public/sections/Announcements/Announcement-extended.types"
import Link from "next/link"

// ─── Aspect-ratio helpers ────────────────────────────────────────────────────

const RATIO_CLASS: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/4": "aspect-square",
  "16/9": "aspect-video",
}

// ─── Content block renderers ─────────────────────────────────────────────────

function BlockParagraph({ block }: { block: Extract<AnnouncementContentBlock, { type: "paragraph" }> }) {
  return (
    <p className="text-[clamp(15px,1.3vw,17px)] font-light leading-relaxed text-gray-600">
      {block.text}
    </p>
  )
}

function BlockList({ block }: { block: Extract<AnnouncementContentBlock, { type: "list" }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {block.items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 text-[clamp(14px,1.2vw,16px)] text-[#0d1117]"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6.5L5 9.5L10 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function BlockImage({ block }: { block: Extract<AnnouncementContentBlock, { type: "image" }> }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)]">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={block.src}
          alt={block.alt}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 832px"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-gray-500">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function BlockVideo({ block }: { block: Extract<AnnouncementContentBlock, { type: "video" }> }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)]">
      <div className="relative aspect-video w-full">
        <video src={block.src} controls className="h-full w-full object-contain" />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-gray-500">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function BlockYoutube({ block }: { block: Extract<AnnouncementContentBlock, { type: "youtube" }> }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)]">
      <div className="relative aspect-video w-full">
        <iframe
          title="Video de YouTube"
          src={`https://www.youtube.com/embed/${block.youtubeId}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-gray-500">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Generic block dispatcher ─────────────────────────────────────────────────

function ContentBlock({ block, index }: { block: AnnouncementContentBlock; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {block.type === "paragraph" && <BlockParagraph block={block} />}
      {block.type === "list" && <BlockList block={block} />}
      {block.type === "image" && <BlockImage block={block} />}
      {block.type === "video" && <BlockVideo block={block} />}
      {block.type === "youtube" && <BlockYoutube block={block} />}
    </motion.div>
  )
}

// ─── Hero media component ─────────────────────────────────────────────────────

function HeroMedia({ Announcement }: { Announcement: AnnouncementExtended }) {
  const { media } = Announcement
  const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] ${ratioClass}`}>
        <iframe
          title={media.alt}
          src={`https://www.youtube.com/embed/${media.youtubeId}`}
          className="absolute inset-0 h-full w-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  if (media.type === "video" && media.src) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] ${ratioClass}`}>
        <video
          src={media.src}
          controls
          className="absolute inset-0 h-full w-full object-cover rounded-2xl"
        />
      </div>
    )
  }
  if (media.src) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] ${ratioClass}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 480px"
          priority
        />
      </div>
    )
  }
  return null
}

// ─── Type pill ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Informative: "border-blue-200 bg-blue-500/10 text-blue-600",
  Urgent: "border-red-200   bg-red-500/10   text-red-600",
  Reminder: "border-amber-200 bg-amber-500/10 text-amber-600",
  Task: "border-purple-200 bg-purple-500/10 text-purple-600",
  General: "border-gray-200  bg-gray-500/10  text-gray-600",
}

// ─── Universal Button Icons ───────────────────────────────────────────────────

function getActionIcon(action?: string) {
  switch (action?.toLowerCase()) {
    case "download":
    case "descargar":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    case "whatsapp":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      )
    case "info":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    case "external-link":
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AnnouncementDetailContent({ Announcement }: { Announcement: AnnouncementExtended }) {
  const typeColor = TYPE_COLORS[Announcement.type ?? ""] ?? TYPE_COLORS.General

  return (
    <section className="relative px-[clamp(20px,6vw,80px)] pb-[clamp(48px,8vw,96px)]">
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/*
            ── Hero 2-column layout ───────────────────────────────────────────
            Desktop: image LEFT (≈ 45% width), description RIGHT.
            Mobile: media top, description below.
          */}
          <div className="mb-10 flex flex-col gap-6 overflow-hidden rounded-2xl border border-[#0d1117]/06
                          bg-white/80 p-6 shadow-[0_20px_60px_rgba(13,17,23,0.08)] backdrop-blur-sm
                          md:flex-row md:items-start md:gap-8 md:p-8">
            {/* LEFT — media */}
            <div className="w-full md:w-[45%] md:shrink-0">
              <HeroMedia Announcement={Announcement} />
            </div>

            {/* RIGHT — description */}
            <div className="flex flex-1 flex-col gap-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {Announcement.type && (
                  <span className={`rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase ${typeColor}`}>
                    {Announcement.type}
                  </span>
                )}
                {Announcement.importante && (
                  <span className="rounded-full border border-red-200 bg-red-500/10 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase text-red-600">
                    Importante
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-1.5 font-sans text-[13px] text-gray-400">
                {Announcement.fecha && <span>{Announcement.fecha}</span>}
                {Announcement.autor && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{Announcement.autor}</span>
                  </>
                )}
              </div>

              {/* Short content */}
              <div className="text-[clamp(15px,1.3vw,17px)] font-light leading-relaxed text-gray-600 space-y-4">
                {Announcement.content?.type === "text" ? (
                  <p>{Announcement.content.text}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {Announcement.content?.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6.5L5 9.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-2 flex flex-wrap items-center gap-4">
               
                {Announcement.secondaryButton?.enabled && (
                  <Link
                    href={Announcement.secondaryButton.href}
                    className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-200
                               bg-transparent px-5 py-2.5 font-sans text-sm font-medium
                               text-gray-700 transition-all hover:bg-gray-50 hover:text-[#0d1117] hover:border-gray-300"
                  >
                    {Announcement.secondaryButton.label}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Extended content blocks */}
          {Announcement.contentBlocks && Announcement.contentBlocks.length > 0 && (
            <div className="mx-auto mt-12 max-w-3xl space-y-6">
              {Announcement.contentBlocks.map((block, i) => (
                <ContentBlock key={i} block={block} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-start pl-2">
            <Link
              href="/Announcements"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[#0d1117] hover:text-blue-600 transition-colors"
            >
              ← Volver a los avisos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
