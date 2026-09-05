"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import type { PhotoItem } from "./types"

type Props = {
  photos: PhotoItem[]
  onOpen?: (index: number) => void
}

/**
 * Scroll-snap carousel: native momentum on touch, arrows and dots on desktop.
 * Each slide keeps the photo uncropped over a blurred backdrop of itself.
 */
export default function PhotoCarousel({ photos, onOpen }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2
        let closest = 0
        let smallest = Number.POSITIVE_INFINITY

        Array.from(track.children).forEach((child, index) => {
          const slide = child as HTMLElement
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2
          const distance = Math.abs(slideCenter - center)
          if (distance < smallest) {
            smallest = distance
            closest = index
          }
        })

        setActive(closest)
      })
    }

    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", onScroll)
    }
  }, [photos.length])

  if (photos.length === 0) return null

  const current = photos[active]
  const hasMultiple = photos.length > 1

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Fotografías del aviso"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <figure
            key={`${photo.src}-${index}`}
            aria-label={`${index + 1} de ${photos.length}`}
            className="relative aspect-16/10 w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-brand-950/90"
          >
            <AnnouncementMediaImageFill
              src={photo.src}
              alt=""
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover scale-110 blur-xl opacity-45 saturate-125"
            />
            <AnnouncementMediaImageFill
              src={photo.src}
              alt={photo.alt}
              sizes="(max-width: 768px) 100vw, 768px"
              className="z-1 object-contain"
              priority={index === 0}
            />
            {onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(index)}
                aria-label={`Ampliar ${photo.alt || `foto ${index + 1}`}`}
                className="absolute right-3 top-3 z-2 flex h-9 w-9 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/50 text-public-on-media opacity-0 transition-opacity duration-200 hover:bg-brand-950/75 focus-visible:opacity-100 group-hover/carousel:opacity-100"
              >
                <IconByName name="expand" className="h-4 w-4" />
              </button>
            ) : null}
          </figure>
        ))}
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => scrollToIndex(Math.max(0, active - 1))}
            disabled={active === 0}
            className="absolute left-2 top-[calc(50%-0.75rem)] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/50 text-public-on-media transition-opacity hover:bg-brand-950/75 disabled:pointer-events-none disabled:opacity-0"
          >
            <IconByName name="chevronLeft" className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => scrollToIndex(Math.min(photos.length - 1, active + 1))}
            disabled={active === photos.length - 1}
            className="absolute right-2 top-[calc(50%-0.75rem)] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/50 text-public-on-media transition-opacity hover:bg-brand-950/75 disabled:pointer-events-none disabled:opacity-0"
          >
            <IconByName name="chevronRight" className="h-5 w-5" />
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {photos.map((photo, index) => (
              <button
                key={`dot-${photo.src}-${index}`}
                type="button"
                aria-label={`Ir a la foto ${index + 1}`}
                aria-current={index === active}
                onClick={() => scrollToIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}

      {current?.caption ? (
        <p className="mt-2 text-center font-sans text-sm text-fg-muted">{current.caption}</p>
      ) : null}
    </div>
  )
}
