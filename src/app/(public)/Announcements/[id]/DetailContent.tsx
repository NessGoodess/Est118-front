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
    <p className="text-[clamp(15px,1.3vw,17px)] font-light leading-relaxed text-fg-muted">
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
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
        <figcaption className="mt-2 text-center font-sans text-sm text-fg-muted">
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
        <figcaption className="mt-2 text-center font-sans text-sm text-fg-muted">
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
        <figcaption className="mt-2 text-center font-sans text-sm text-fg-muted">
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
  Informative: "border-border bg-primary-soft0/10 text-primary",
  Urgent: "border-red-200   bg-red-500/10   text-red-600",
  Reminder: "border-amber-200 bg-amber-500/10 text-amber-600",
  Task: "border-purple-200 bg-purple-500/10 text-purple-600",
  General: "border-border  bg-surface-muted0/10  text-fg-muted",
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
                          bg-surface-elevated/80 p-6 shadow-[0_20px_60px_rgba(13,17,23,0.08)] backdrop-blur-sm
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
              <div className="flex flex-wrap items-center gap-1.5 font-sans text-[13px] text-fg-muted">
                {Announcement.fecha && <span>{Announcement.fecha}</span>}
                {Announcement.autor && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{Announcement.autor}</span>
                  </>
                )}
              </div>

              {/* Short content */}
              <div className="text-[clamp(15px,1.3vw,17px)] font-light leading-relaxed text-fg-muted space-y-4">
                {Announcement.content?.type === "text" ? (
                  <p>{Announcement.content.text}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {Announcement.content?.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                    className="inline-flex w-fit items-center gap-2 rounded-md border border-border
                               bg-transparent px-5 py-2.5 font-sans text-sm font-medium
                               text-foreground transition-all hover:bg-surface-muted hover:text-[#0d1117] hover:border-border"
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
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[#0d1117] hover:text-primary transition-colors"
            >
              ← Volver a los avisos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
