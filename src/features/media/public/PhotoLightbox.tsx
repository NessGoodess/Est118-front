"use client"

import { useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageDetail } from "@/features/announcements/shared/AnnouncementMediaImage"
import type { PhotoItem } from "./types"

type Props = {
  photos: PhotoItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Fullscreen photo viewer with keyboard navigation. */
export default function PhotoLightbox({ photos, index, onClose, onNavigate }: Props) {
  const isOpen = index !== null && index >= 0 && index < photos.length

  const goTo = useCallback(
    (next: number) => {
      if (photos.length === 0) return
      const wrapped = (next + photos.length) % photos.length
      onNavigate(wrapped)
    },
    [photos.length, onNavigate]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") goTo((index as number) + 1)
      if (event.key === "ArrowLeft") goTo((index as number) - 1)
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, index, goTo, onClose])

  const photo = isOpen ? photos[index as number] : null

  return (
    <AnimatePresence>
      {photo ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt || "Fotografía ampliada"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-brand-950/95 px-4 py-16 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-public-glass-border bg-public-glass text-public-on-media transition-opacity hover:opacity-80"
          >
            <IconByName name="x" className="h-5 w-5" />
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(event) => {
                  event.stopPropagation()
                  goTo((index as number) - 1)
                }}
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-public-glass text-public-on-media transition-opacity hover:opacity-80 sm:left-6"
              >
                <IconByName name="chevronLeft" className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                onClick={(event) => {
                  event.stopPropagation()
                  goTo((index as number) + 1)
                }}
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-public-glass text-public-on-media transition-opacity hover:opacity-80 sm:right-6"
              >
                <IconByName name="chevronRight" className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <motion.figure
            key={photo.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
          >
            <AnnouncementMediaImageDetail
              src={photo.src}
              alt={photo.alt}
              priority
              className="h-auto max-h-[75vh] w-auto max-w-full rounded-xl object-contain"
            />
            <figcaption className="text-center text-sm text-public-on-media-muted">
              {photo.caption || photo.alt}
              {photos.length > 1 ? (
                <span className="ml-2 font-mono text-xs text-accent-gold">
                  {(index as number) + 1}/{photos.length}
                </span>
              ) : null}
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
