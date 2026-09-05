"use client"

import { motion } from "framer-motion"
import type { AnnouncementExtended } from "@/features/announcements/types/announcement"
import Link from "next/link"
import FacebookShareButton from "@/features/announcements/shared/FacebookShareButton"
import FacebookComments from "@/features/announcements/public/FacebookComments"
import FacebookPostEmbed from "@/features/announcements/public/FacebookPostEmbed"
import ContentBlocks from "@/features/announcements/public/ContentBlocks"
import { AnnouncementMediaImageDetail } from "@/features/announcements/shared/AnnouncementMediaImage"
import { cardDisplayText } from "@/features/announcements/lib/announcement-display"

const RATIO_CLASS: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/4": "aspect-square",
  "16/9": "aspect-video",
}

function HeroMedia({ announcement }: { announcement: AnnouncementExtended }) {
  const { media } = announcement
  const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]
  const facebookUrl =
    media.type === "facebook"
      ? media.facebookPostUrl?.trim() || announcement.facebookPostUrl?.trim() || ""
      : ""

  if (media.type === "facebook" && facebookUrl) {
    return <FacebookPostEmbed postUrl={facebookUrl} />
  }

  // Video / YouTube keep a fixed frame; images keep natural aspect (no crop).
  const framedClass = `relative w-full max-h-[min(70vh,720px)] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(13,17,23,0.12)] ${ratioClass}`

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <figure className={framedClass}>
        <iframe
          title={media.alt || announcement.title}
          src={`https://www.youtube.com/embed/${media.youtubeId}`}
          className="absolute inset-0 h-full w-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <figcaption className="sr-only">{media.alt || announcement.title}</figcaption>
      </figure>
    )
  }
  if (media.type === "video" && media.src) {
    return (
      <figure className={framedClass}>
        <video
          src={media.src}
          controls
          className="absolute inset-0 h-full w-full object-contain rounded-2xl bg-black"
        />
        <figcaption className="sr-only">{media.alt || announcement.title}</figcaption>
      </figure>
    )
  }
  if (media.src) {
    return (
      <figure className="flex flex-col items-center">
        <AnnouncementMediaImageDetail
          src={media.src}
          alt={media.alt}
          priority
        />
        <figcaption className="sr-only">{media.alt || announcement.title}</figcaption>
      </figure>
    )
  }
  return null
}

function hasHeroMedia(announcement: AnnouncementExtended): boolean {
  const { media } = announcement
  if (media.type === "facebook") {
    return Boolean(media.facebookPostUrl?.trim() || announcement.facebookPostUrl?.trim())
  }
  if (media.type === "youtube") return Boolean(media.youtubeId)
  return Boolean(media.src)
}

export default function AnnouncementDetailContent({
  Announcement,
}: {
  Announcement: AnnouncementExtended
}) {
  const summaryText = cardDisplayText(Announcement)
  const showMedia = hasHeroMedia(Announcement)
  const blocks = Announcement.contentBlocks ?? []
  const hasBody = Boolean(summaryText) || blocks.length > 0

  return (
    <article className="relative px-[clamp(20px,5vw,64px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,8vw,96px)]">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {showMedia ? (
            <div
              className="relative mb-10 overflow-hidden rounded-2xl border border-foreground/6
                         bg-surface-elevated/80 p-4 shadow-[0_20px_60px_rgba(13,17,23,0.08)]
                         backdrop-blur-sm md:p-6 lg:p-8"
            >
              <div className="absolute right-3 top-3 z-10 md:right-5 md:top-5">
                <FacebookShareButton
                  idOrSlug={Announcement.slug || Announcement.id}
                  title={Announcement.title}
                  size="icon"
                />
              </div>
              <HeroMedia announcement={Announcement} />
              {Announcement.secondaryButton?.enabled ? (
                <p className="mt-5 flex justify-center md:justify-start">
                  <Link
                    href={Announcement.secondaryButton.href}
                    className="inline-flex w-fit items-center gap-2 rounded-md border border-border
                               bg-transparent px-5 py-2.5 font-sans text-sm font-medium
                               text-foreground transition-all hover:bg-surface-muted hover:border-border"
                  >
                    {Announcement.secondaryButton.label}
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}

          {hasBody ? (
            <section
              className="mx-auto max-w-3xl space-y-8"
              aria-label="Contenido del aviso"
            >
              {summaryText ? (
                <p className="border-l-4 border-primary/40 pl-5 text-[clamp(17px,1.4vw,20px)] font-light leading-relaxed text-foreground">
                  {summaryText}
                </p>
              ) : null}

              <ContentBlocks blocks={blocks} />
            </section>
          ) : null}

          {!showMedia && Announcement.secondaryButton?.enabled ? (
            <p className="mx-auto mt-6 max-w-3xl">
              <Link
                href={Announcement.secondaryButton.href}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium"
              >
                {Announcement.secondaryButton.label}
              </Link>
            </p>
          ) : null}

          <div className="mx-auto max-w-3xl">
            <FacebookComments idOrSlug={Announcement.slug || Announcement.id} />
          </div>

          <nav className="mx-auto mt-10 flex max-w-3xl justify-start" aria-label="Volver">
            <Link
              href="/Announcements"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              ← Volver a los avisos
            </Link>
          </nav>
        </motion.div>
      </div>
    </article>
  )
}
