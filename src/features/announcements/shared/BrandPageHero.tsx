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
  lg: "h-64 md:h-80",
  md: "h-52 md:h-64",
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
      className={`relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-700 to-brand-900 ${SIZE_CLASS[size]}`}
    >
      <div
        className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-brand-700/70"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          {eyebrow ? (
            <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.07em] text-white/80">
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
              className={`max-w-3xl text-white/90 ${
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
