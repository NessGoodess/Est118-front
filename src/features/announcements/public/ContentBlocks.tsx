"use client"

import { motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageDetail } from "@/features/announcements/shared/AnnouncementMediaImage"
import { PhotoGalleryBlock } from "@/features/media"
import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement"

type Block<T extends AnnouncementContentBlock["type"]> = Extract<
  AnnouncementContentBlock,
  { type: T }
>

function BlockParagraph({ block }: { block: Block<"paragraph"> }) {
  return (
    <p className="text-[clamp(15px,1.3vw,17px)] font-light leading-relaxed text-fg-muted">
      {block.text}
    </p>
  )
}

function BlockList({ block }: { block: Block<"list"> }) {
  return (
    <ul className="flex flex-col gap-2">
      {block.items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 text-[clamp(14px,1.2vw,16px)] text-foreground"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconByName name="check" className="h-3 w-3" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function BlockImage({ block }: { block: Block<"image"> }) {
  const imgClass =
    "h-auto max-h-[min(70vh,720px)] w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_20px_60px_rgba(13,17,23,0.12)]"

  return (
    <figure className="my-6 flex flex-col items-center">
      <AnnouncementMediaImageDetail src={block.src} alt={block.alt} className={imgClass} />
      {block.caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-fg-muted">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function BlockVideo({ block }: { block: Block<"video"> }) {
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

function BlockYoutube({ block }: { block: Block<"youtube"> }) {
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

export function ContentBlock({
  block,
  index,
}: {
  block: AnnouncementContentBlock
  index: number
}) {
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
      {block.type === "gallery" && (
        <PhotoGalleryBlock
          photos={block.images}
          layout={block.layout}
          title={block.title}
          caption={block.caption}
          albumHref={block.albumHref}
        />
      )}
    </motion.div>
  )
}

/** Renders the extended body shared by announcements and events. */
export default function ContentBlocks({
  blocks,
}: {
  blocks: AnnouncementContentBlock[]
}) {
  if (blocks.length === 0) return null

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <ContentBlock key={i} block={block} index={i} />
      ))}
    </div>
  )
}
