"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type BrandPageHeroSize = "lg" | "md"

interface BrandPageHeroProps {
  title: string
  description?: string
  eyebrow?: string
  /** Optional row below title (badges, date, etc.) */
  meta?: ReactNode
  size?: BrandPageHeroSize
}

const SIZE_CLASS: Record<BrandPageHeroSize, string> = {
  lg: "min-h-48 md:min-h-56",
  md: "min-h-36 md:min-h-44",
}

/** Dark brand band used across public CMS pages (avisos, eventos, galería). */
export default function BrandPageHero({
  title,
  description,
  eyebrow,
  meta,
  size = "lg",
}: BrandPageHeroProps) {
  return (
    <header
      className="public-hero-offset relative overflow-hidden bg-linear-to-r from-brand-900 via-brand-700 to-brand-900"
    >
      <div
        className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-brand-900/90 to-brand-700/70"
        aria-hidden
      />
      <div
        className={`relative z-10 mx-auto flex max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8 ${SIZE_CLASS[size]}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-public-on-media"
        >
          {eyebrow ? (
            <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.07em] text-public-on-media/80">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`font-merriweather font-bold ${
              size === "lg"
                ? "mb-4 text-4xl md:text-5xl"
                : "mb-3 text-[clamp(26px,3.5vw,42px)] leading-tight"
            }`}
          >
            {title}
          </h1>
          {meta ? <div className="mb-1">{meta}</div> : null}
          {description ? (
            <p
              className={`max-w-3xl text-public-on-media/90 ${
                size === "lg" ? "text-xl md:text-2xl" : "text-base md:text-lg"
              }`}
            >
              {description}
            </p>
          ) : null}
        </motion.div>
      </div>
    </header>
  )
}
