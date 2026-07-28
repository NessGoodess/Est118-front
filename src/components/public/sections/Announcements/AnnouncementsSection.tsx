"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import type { AnnouncementCardData } from "./Announcement-extended.types"
import { IconByName } from "@/components/ui/icons/public/section.icons"
import FeaturedAnnouncements from "./FeaturedAnnouncement"
import { motion } from "framer-motion"

interface AnnouncementsectionProps {
  Announcements: AnnouncementCardData[]
}

export default function Announcementsection({ Announcements }: AnnouncementsectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const featured = Announcements[selectedIndex] ?? Announcements[0]
  const canGoPrev = selectedIndex > 0
  const canGoNext = selectedIndex < Announcements.length - 1

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
    <section id="notices"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#f5f3ef]
                 px-[clamp(20px,6vw,80px)] py-[clamp(24px,5vw,64px)] lg:items-stretch"
    >
      {/* Background gradient */}
      <div aria-hidden
        className="pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_70%_20%,rgba(232,64,64,0.07)_0%,transparent_50%),
            radial-gradient(circle_at_20%_80%,rgba(26,86,219,0.06)_0%,transparent_45%)]"
      />

      <motion.header
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-merriweather">
          Noticias y <span className="text-primary">Avisos</span>
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4" />
        <p className="hidden lg:block text-lg text-fg-muted max-w-2xl mx-auto">
          Mantente informado sobre los comunicados importantes de nuestra institución.
        </p>
      </motion.header>

      {/* Main area: featured notice */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center lg:pr-6 mx-auto w-full max-w-7xl items-center
                    gap-[clamp(32px,6vw,80px)]">
        <FeaturedAnnouncements data={featured} />
      </div>

      {/* Nav bar visible on mobile at bottom, on desktop at sidebar-bottom-right */}
      <div
        className="
          mt-6 flex items-center justify-between gap-3
          lg:absolute lg:bottom-6 lg:right-[clamp(20px,6vw,80px)] lg:mt-0
        "
      >
        {/* Notice counter */}
        <span className="font-sans text-xs font-medium text-fg-muted select-none lg:mr-2">
          {selectedIndex + 1} / {Announcements.length}
        </span>

        {/* See all link */}
        <Link
          href="/Announcements"
          className="font-sans text-xs font-medium text-[#0d1117] underline-offset-2 hover:underline lg:mr-4"
        >
          Ver todos los avisos
        </Link>

        {/* Prev */}
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous notice"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                     border-[#0d1117]/15 bg-surface-elevated/90 text-[#0d1117] shadow-sm backdrop-blur-sm
                     transition-all hover:bg-surface-elevated hover:shadow-md
                     disabled:pointer-events-none disabled:opacity-30"
        >
          <IconByName name="leftArrow" />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next notice"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                     border-[#0d1117]/15 bg-surface-elevated/90 text-[#0d1117] shadow-sm backdrop-blur-sm
                     transition-all hover:bg-surface-elevated hover:shadow-md
                     disabled:pointer-events-none disabled:opacity-30"
        >
          <IconByName name="rightArrow" />
        </button>
      </div>
    </section>
  )
}
