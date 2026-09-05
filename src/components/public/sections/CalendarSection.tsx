"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconByName } from "@/components/ui/icons";
import type { PublicEvent } from "@/features/events/types/event";
import {
  MONTHS,
  eventDateBadge,
  eventRangeLabel,
  eventTypeIcon,
} from "@/features/events/lib/event-display";

export default function CalendarSection({ events }: { events: PublicEvent[] }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const date = new Date(event.startsAt);
        return !Number.isNaN(date.getTime()) && date.getMonth() === selectedMonth;
      }),
    [events, selectedMonth]
  );

  return (
    <>
      <section className="sticky top-[var(--public-sticky-top)] z-40 border-b border-border bg-surface-elevated/95 shadow-sm backdrop-blur-md transition-[top] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(index)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  selectedMonth === index
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface-muted text-foreground hover:bg-surface-muted/80"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => {
              const badge = eventDateBadge(event);
              const range = eventRangeLabel(event);

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={`/eventos/${event.slug || event.id}`}
                    className="block h-full overflow-hidden rounded-2xl border border-border border-l-4 border-l-primary bg-surface-elevated shadow-xl transition-shadow hover:shadow-2xl"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-start gap-4">
                        <div className="min-w-[72px] rounded-lg bg-accent-gold p-3 text-center text-brand-950">
                          <p className="text-xs font-semibold uppercase">Fecha</p>
                          <p className="text-lg font-bold">{badge.day}</p>
                          <p className="text-xs">{badge.month}</p>
                        </div>
                        <div className="flex-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                            <IconByName name={eventTypeIcon(event.type)} className="h-3.5 w-3.5" />
                            {event.type}
                          </span>
                          {event.important ? (
                            <span className="ml-2 inline-flex items-center rounded-full bg-danger/10 px-2 py-1 text-xs font-medium text-danger">
                              Importante
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <h3 className="mb-2 text-lg font-bold text-foreground">{event.title}</h3>
                      {event.summary ? (
                        <p className="mb-4 text-sm leading-relaxed text-fg-muted">{event.summary}</p>
                      ) : null}

                      {range || event.location ? (
                        <div className="flex flex-col gap-2 text-sm text-fg-muted">
                          {range ? (
                            <div className="flex items-center gap-2">
                              <IconByName name="clock" className="h-4 w-4 shrink-0" />
                              <span>{range}</span>
                            </div>
                          ) : null}
                          {event.location ? (
                            <div className="flex items-center gap-2">
                              <IconByName name="mapPin" className="h-4 w-4 shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-elevated py-16 text-center">
            <IconByName name="calendar" className="mx-auto mb-3 h-10 w-10 text-fg-muted" />
            <p className="text-fg-muted">
              No hay eventos programados para {MONTHS[selectedMonth]}.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl"
          >
            Ver todos los eventos
          </Link>
        </div>
      </section>
    </>
  );
}
