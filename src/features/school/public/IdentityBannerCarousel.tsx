"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { AnnouncementMediaImageFill } from "@/features/announcements/shared/AnnouncementMediaImage"
import { IDENTITY_BANNERS } from "./content/identity-banners"

const INTERVAL_MS = 6500
const ease = [0.16, 1, 0.3, 1] as const

export default function IdentityBannerCarousel() {
  const slides = IDENTITY_BANNERS
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = slides.length
  const slide = slides[index]

  const go = useCallback(
    (next: number) => {
      setIndex((next + total) % total)
    },
    [total]
  )

  useEffect(() => {
    if (paused || total < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total)
    }, INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [paused, total])

  return (
    <section
      id="identidad"
      aria-roledescription="carrusel"
      aria-label="Identidad estudiantil de la Técnica 118"
      className="relative scroll-mt-[var(--public-header-offset)] bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9] sm:min-h-[340px] sm:max-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-0"
          >
            <AnnouncementMediaImageFill
              src={slide.src}
              alt={slide.alt}
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-brand-950/70 via-brand-950/25 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950/45 via-transparent to-brand-950/10" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl items-end px-4 pb-14 sm:items-center sm:px-6 sm:pb-0 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide.id}-copy`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease }}
              className="max-w-xl text-public-on-media"
            >
              <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-public-cta">
                {slide.eyebrow}
              </p>
              <h2 className="font-merriweather text-[clamp(1.6rem,4vw,2.75rem)] font-bold leading-tight">
                {slide.title}
              </h2>
              <div className="mt-3 h-1 w-16 bg-accent-gold" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-public-on-media/85 sm:text-base">
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-public-cta px-5 py-2.5 text-sm font-semibold text-public-cta-fg transition-colors hover:brightness-95"
              >
                {slide.cta}
                <IconByName name="arrowRight" className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/45 text-public-on-media backdrop-blur-sm transition-colors hover:bg-brand-950/70 sm:flex"
            >
              <IconByName name="chevronLeft" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Banner siguiente"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-public-glass-border bg-brand-950/45 text-public-on-media backdrop-blur-sm transition-colors hover:bg-brand-950/70 sm:flex"
            >
              <IconByName name="chevronRight" className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir al banner ${slideIndex + 1}: ${item.title}`}
              aria-current={slideIndex === index ? true : undefined}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slideIndex === index
                  ? "w-8 bg-public-cta"
                  : "w-2 bg-public-on-media/35 hover:bg-public-on-media/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
