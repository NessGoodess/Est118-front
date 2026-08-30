"use client"

import { AnnouncementMedia } from "@/features/announcements/types/announcement"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import FacebookMediaPlaceholder from "@/features/announcements/shared/FacebookMediaPlaceholder"

const RATIO_CLASS: Record<NonNullable<AnnouncementMedia["ratio"]>, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/4": "aspect-square",
}

type MediaBlockProps = {
  media: AnnouncementMedia
  /** When parent already sets size/ratio, fill absolute inset instead of wrapping. */
  fillParent?: boolean
}

export default function MediaBlock({ media, fillParent = false }: MediaBlockProps) {
  const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]
  const shellClass = fillParent
    ? "absolute inset-0 h-full w-full overflow-hidden"
    : `relative w-full overflow-hidden rounded-2xl ${ratioClass}`

  if (media.type === "facebook") {
    return (
      <div className={shellClass}>
        <FacebookMediaPlaceholder className="absolute inset-0" />
      </div>
    )
  }

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <div className={shellClass}>
        <iframe
          title={media.alt || "Video de YouTube"}
          src={`https://www.youtube.com/embed/${media.youtubeId}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (media.type === "video" && media.src) {
    return (
      <div className={shellClass}>
        <video
          src={media.src}
          controls
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }

  if (media.src) {
    return (
      <div className={shellClass}>
        <AnnouncementMediaImageFill
          src={media.src}
          alt={media.alt}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority={fillParent}
        />
      </div>
    )
  }

  return null
}
