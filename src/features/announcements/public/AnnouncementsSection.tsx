"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import type { AnnouncementCardData } from "@/features/announcements/types/announcement"
import { IconByName } from "@/components/ui/icons"
import FeaturedAnnouncements from "./FeaturedAnnouncement"
import { motion } from "framer-motion"

interface AnnouncementsSectionProps {
  Announcements: AnnouncementCardData[]
}

export default function AnnouncementsSection({ Announcements }: AnnouncementsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const featured = Announcements[selectedIndex] ?? Announcements[0]
  const canGoPrev = selectedIndex > 0
  const canGoNext = selectedIndex < Announcements.length - 1
  const total = Announcements.length

  const scrollToSelected = useCallback(() => {
    const el = itemRefs.current[selectedIndex]
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedIndex])

  const goPrev = useCallback(() => {
    if (!canGoPrev) return
    setSelectedIndex((i) => i - 1)
    setTimeout(scrollToSelected, 80)
  }, [canGoPrev, scrollToSelected])

  const goNext = useCallback(() => {
    if (!canGoNext) return
    setSelectedIndex((i) => i + 1)
    setTimeout(scrollToSelected, 80)
  }, [canGoNext, scrollToSelected])

  if (!Announcements.length) return null

  return (
    <section
      id="notices"
      aria-labelledby="announcements-heading"
      className="relative overflow-hidden bg-surface-app py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              id="announcements-heading"
              className="mb-4 font-merriweather text-4xl font-bold text-foreground md:text-5xl"
            >
              Noticias y <span className="text-primary">avisos</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 bg-accent-gold" aria-hidden />
            <p className="mx-auto max-w-2xl text-lg text-fg-muted">
              Mantente informado sobre los comunicados importantes de nuestra institución.
            </p>
          </motion.div>
        </header>

        <div
          className="relative flex min-h-[min(65vh,640px)] flex-col justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <FeaturedAnnouncements key={featured.id} data={featured} />
        </div>

        <nav
          className="mt-8 flex items-center justify-between gap-3 lg:justify-end"
          aria-label="Navegación de avisos destacados"
        >
          <p className="select-none font-sans text-xs font-medium text-fg-muted lg:mr-2">
            <span className="sr-only">Aviso </span>
            {selectedIndex + 1}
            <span aria-hidden> / </span>
            <span className="sr-only">de </span>
            {total}
          </p>

          <Link
            href="/Announcements"
            className="font-sans text-xs font-medium text-foreground underline-offset-2 hover:underline lg:mr-4"
          >
            Ver todos los avisos
          </Link>

          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Aviso anterior"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                       border-border bg-surface-elevated/90 text-foreground shadow-sm backdrop-blur-sm
                       transition-all hover:bg-surface-elevated hover:shadow-md
                       disabled:pointer-events-none disabled:opacity-30"
          >
            <IconByName name="chevronLeft" />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Aviso siguiente"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                       border-border bg-surface-elevated/90 text-foreground shadow-sm backdrop-blur-sm
                       transition-all hover:bg-surface-elevated hover:shadow-md
                       disabled:pointer-events-none disabled:opacity-30"
          >
            <IconByName name="chevronRight" />
          </button>
        </nav>
      </div>
    </section>
  )
}
