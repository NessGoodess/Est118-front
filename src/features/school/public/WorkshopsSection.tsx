"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconByName } from "@/components/ui/icons"
import { PUBLIC_WORKSHOPS } from "./content/workshops"

const ease = [0.16, 1, 0.3, 1] as const

export default function WorkshopsSection() {
  return (
    <section
      id="talleres"
      aria-labelledby="workshops-heading"
      className="relative scroll-mt-[var(--public-header-h-compact)] overflow-hidden bg-surface-app py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Formación técnica
            </p>
            <h2
              id="workshops-heading"
              className="mb-4 font-merriweather text-4xl font-bold text-foreground md:text-5xl"
            >
              Nuestros <span className="text-primary">talleres</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 bg-accent-gold" aria-hidden />
            <p className="mx-auto max-w-2xl text-lg text-fg-muted">
              En la Técnica 118 la secundaria se vive en el taller: cuatro especialidades
              que distinguen a esta escuela desde 1984.
            </p>
          </motion.div>
        </header>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_WORKSHOPS.map((workshop, index) => (
            <motion.li
              key={workshop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06, ease }}
            >
              <article className="flex h-full flex-col rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold text-brand-950">
                  <IconByName name={workshop.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-merriweather text-lg font-bold leading-snug text-foreground">
                  {workshop.shortName}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
                  {workshop.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>

        <p className="mt-10 text-center">
          <Link
            href="/inscripciones"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Ver preinscripciones
            <IconByName name="arrowRight" className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  )
}
