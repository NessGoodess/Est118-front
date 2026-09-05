"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import type { PublicEvent } from "@/features/events/types/event"
import {
  eventDateBadge,
  eventRangeLabel,
  eventTypeIcon,
  isEventPast,
} from "@/features/events/lib/event-display"

type Filter = "upcoming" | "past" | "all"

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "upcoming", label: "Próximos" },
  { value: "past", label: "Anteriores" },
  { value: "all", label: "Todos" },
]

export default function EventsList({ events }: { events: PublicEvent[] }) {
  const [filter, setFilter] = useState<Filter>("upcoming")

  const filtered = useMemo(() => {
    if (filter === "all") return events
    const past = filter === "past"
    const list = events.filter((event) => isEventPast(event) === past)
    return past ? [...list].reverse() : list
  }, [events, filter])

  if (events.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconByName name="calendarDays" className="h-7 w-7" />
        </span>
        <h2 className="font-merriweather text-2xl font-bold text-foreground">
          Todavía no hay eventos publicados
        </h2>
        <p className="mt-2 text-fg-muted">
          Aquí aparecerán ceremonias, torneos, ferias y demás actividades de la escuela.
        </p>
      </section>
    )
  }

  return (
    <>
      <nav
        aria-label="Filtro de eventos"
        className="sticky top-[var(--public-sticky-top)] z-40 border-b border-border bg-surface-elevated/95 shadow-sm backdrop-blur-md transition-[top] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {FILTERS.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === option.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-surface-muted text-foreground hover:bg-primary-soft"
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.ul
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2"
          >
            {filtered.map((event, index) => {
              const badge = eventDateBadge(event)
              const range = eventRangeLabel(event)

              return (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
                >
                  <Link
                    href={`/eventos/${event.slug || event.id}`}
                    className="group flex h-full gap-5 overflow-hidden rounded-2xl border border-border border-l-4 border-l-primary bg-surface-elevated p-6 shadow-md transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex h-fit min-w-[72px] flex-col items-center rounded-lg bg-accent-gold px-3 py-2 text-brand-950">
                      <span className="font-mono text-2xl font-bold leading-tight">
                        {badge.day}
                      </span>
                      <span className="text-[11px] font-bold tracking-wide">{badge.month}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                          <IconByName name={eventTypeIcon(event.type)} className="h-3.5 w-3.5" />
                          {event.type}
                        </span>
                        {event.important ? (
                          <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                            Importante
                          </span>
                        ) : null}
                      </div>

                      <h2 className="font-merriweather text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {event.title}
                      </h2>

                      {event.summary ? (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">
                          {event.summary}
                        </p>
                      ) : null}

                      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <IconByName name="clock" className="h-4 w-4 shrink-0 text-primary" />
                          <dt className="sr-only">Fecha</dt>
                          <dd className="text-fg-muted">
                            {range ?? `${event.dateLabel}${event.timeLabel ? ` · ${event.timeLabel}` : ""}`}
                          </dd>
                        </div>
                        {event.location ? (
                          <div className="flex items-center gap-2">
                            <IconByName name="mapPin" className="h-4 w-4 shrink-0 text-primary" />
                            <dt className="sr-only">Lugar</dt>
                            <dd className="text-fg-muted">{event.location}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </motion.ul>
        </AnimatePresence>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-lg text-fg-muted">
            {filter === "upcoming"
              ? "No hay eventos próximos por ahora."
              : "No hay eventos anteriores registrados."}
          </p>
        ) : null}
      </section>
    </>
  )
}
