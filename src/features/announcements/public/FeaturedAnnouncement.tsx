"use client"

import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import type { AnnouncementCardData, AnnouncementMedia } from "@/features/announcements/types/announcement"
import { cardDisplayText, splitLayoutOrder } from "@/features/announcements/lib/announcement-display"
import { motion, type Variants } from "framer-motion"
import MediaBlock from "./MediaBlock"

const RATIO_CLASS: Record<NonNullable<AnnouncementMedia["ratio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/4": "aspect-square",
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const slideIn = (direction: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: direction === "right" ? 40 : -40, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
  },
})

const inView = { once: true, amount: 0.2 } as const

function PulseBadge({ label }: { label: string }) {
  return (
    <motion.p
      variants={fadeUp}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5"
      role="status"
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
      </span>
      <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-danger">
        {label}
      </span>
    </motion.p>
  )
}

/** Featured notice — text ~40% / media ~60% (home). */
export default function FeaturedAnnouncements({ data }: { data: AnnouncementCardData }) {
  const { headerAlert, header, title, secondaryButton, media } = data
  const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]
  const layout = splitLayoutOrder(media.position ?? "right")
  const summaryText = cardDisplayText(data)
  const mediaFrom = media.position === "left" ? "left" : "right"

  return (
    <article className="grid h-full w-full grid-cols-1 items-center gap-[clamp(24px,4vw,40px)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <motion.div
        className={`flex flex-col lg:pr-2 ${layout.text}`}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
      >
        <header>
          {headerAlert?.enabled && (
            <PulseBadge label={headerAlert.label ?? "Aviso Importante"} />
          )}
          <motion.p
            variants={fadeUp}
            className="mb-3 font-sans text-[clamp(11px,1vw,13px)] font-bold uppercase tracking-[0.07em] text-primary"
          >
            {header}
          </motion.p>
          <motion.h3
            variants={fadeUp}
            className="mb-4 font-merriweather text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.1] tracking-tight text-foreground"
          >
            {title}
          </motion.h3>
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              show: {
                scaleX: 1,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
            className="mb-5 block h-[3px] w-9 origin-left rounded-full bg-danger"
            aria-hidden
          />
        </header>

        {summaryText && (
          <motion.p
            variants={fadeUp}
            className="mb-6 text-[clamp(15px,1.2vw,17px)] font-light leading-relaxed text-fg-muted"
          >
            {summaryText}
          </motion.p>
        )}

        <motion.p variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <Link
            href={`/Announcements/${data.slug || data.id}`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-6 py-3.5
                       font-sans text-[15px] font-medium text-primary-foreground transition-colors
                       hover:bg-primary-hover"
          >
            {media.type === "facebook" ? "Ver publicación" : "Leer más"}
            <IconByName name="arrowRight" className="h-4 w-4" aria-hidden />
          </Link>
          {secondaryButton?.enabled && (
            <Link
              href={secondaryButton.href}
              className="inline-flex items-center gap-1.5 border-b border-transparent pb-0.5
                         font-sans text-sm text-fg-muted transition-colors
                         hover:border-foreground hover:text-foreground"
            >
              {secondaryButton.label}
              <IconByName name="arrowRight" className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </motion.p>
      </motion.div>

      <motion.figure
        className={`relative w-full ${layout.media}`}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={slideIn(mediaFrom)}
      >
        <div
          className={`relative w-full max-h-[min(56vh,580px)] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] ${ratioClass}`}
        >
          <MediaBlock media={media} fillParent />
        </div>
        <figcaption className="sr-only">{media.alt || title}</figcaption>
      </motion.figure>
    </article>
  )
}
