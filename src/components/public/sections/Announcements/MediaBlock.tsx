"use client"
import Image from "next/image"
import { AnnouncementMedia } from "./Announcement-extended.types"

const RATIO_CLASS: Record<NonNullable<AnnouncementMedia["ratio"]>, string> = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "4/4": "aspect-square",
}

export default function MediaBlock({ media }: { media: AnnouncementMedia }) {
    const ratioClass = RATIO_CLASS[media.ratio ?? "4/3"]

    if (media.type === "youtube" && media.youtubeId) {
        return (
            <div className={`relative w-full overflow-hidden rounded-2xl ${ratioClass}`}>
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
            <div className={`relative w-full overflow-hidden rounded-2xl ${ratioClass}`}>
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
            <div className={`relative w-full overflow-hidden rounded-2xl ${ratioClass}`}>
                <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>
        )
    }

    return null
}
