"use client"

import { motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import type { PhotoItem } from "./types"

type Props = {
  photos: PhotoItem[]
  onOpen?: (index: number) => void
}

/** Uniform photo grid; the first photo spans two columns when there are enough. */
export default function PhotoGrid({ photos, onOpen }: Props) {
  if (photos.length === 0) return null

  const featureFirst = photos.length >= 3

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => {
        const wide = featureFirst && index === 0

        return (
          <motion.figure
            key={`${photo.src}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
            className={`group relative overflow-hidden rounded-xl bg-brand-950/90 ${
              wide ? "col-span-2 aspect-16/10 sm:row-span-2 sm:aspect-auto" : "aspect-square"
            }`}
          >
            <AnnouncementMediaImageFill
              src={photo.src}
              alt={photo.alt}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(index)}
                aria-label={`Ampliar ${photo.alt || `foto ${index + 1}`}`}
                className="absolute inset-0 z-1 flex items-end justify-end bg-linear-to-t from-brand-950/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/60 text-public-on-media">
                  <IconByName name="expand" className="h-3.5 w-3.5" />
                </span>
              </button>
            ) : null}
            {photo.caption ? (
              <figcaption className="sr-only">{photo.caption}</figcaption>
            ) : null}
          </motion.figure>
        )
      })}
    </div>
  )
}
