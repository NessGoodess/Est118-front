"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IconByName, type AppIconName } from "@/components/ui/icons";
import { calendarioEscolar, type CalendarioItem } from "@/lib/data/mockData";
import PublicPageHero from "./PublicPageHero";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const TYPE_ICONS: Record<CalendarioItem["tipo"], AppIconName> = {
  Vacaciones: "calendar",
  Examen: "fileText",
  Evento: "calendarTime",
  Suspension: "alert",
  Entrega: "upload",
  Junta: "users",
};

export default function CalendarSection() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const filteredEvents = useMemo(
    () =>
      calendarioEscolar.filter(
        (event) => new Date(event.fecha).getMonth() === selectedMonth
      ),
    [selectedMonth]
  );

  return (
    <div className="min-h-screen bg-surface-app">
      <PublicPageHero
        title="Calendario Escolar"
        description="Fechas importantes, vacaciones, exámenes y eventos del ciclo escolar"
      />

      <section className="sticky top-[var(--public-header-h-compact)] z-40 border-b border-border bg-surface-elevated/95 backdrop-blur-md shadow-sm">
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
              const eventDate = new Date(event.fecha);
              const endDate = event.fechaFin ? new Date(event.fechaFin) : null;

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl border-l-4 border-l-primary"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="min-w-[72px] rounded-lg bg-accent-gold p-3 text-center text-foreground">
                        <p className="text-xs font-semibold uppercase">Fecha</p>
                        <p className="text-lg font-bold">{eventDate.getDate()}</p>
                        <p className="text-xs">{MONTHS[eventDate.getMonth()].slice(0, 3)}</p>
                      </div>
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                          <IconByName name={TYPE_ICONS[event.tipo]} className="h-3.5 w-3.5" />
                          {event.tipo}
                        </span>
                        {event.importante ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-danger/10 px-2 py-1 text-xs font-medium text-danger">
                            Importante
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-foreground">{event.titulo}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-fg-muted">{event.descripcion}</p>

                    {endDate ? (
                      <div className="flex items-center gap-2 text-sm text-fg-muted">
                        <IconByName name="clock" className="h-4 w-4 shrink-0" />
                        <span>
                          {eventDate.getDate()} – {endDate.getDate()} de {MONTHS[eventDate.getMonth()]}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-elevated py-16 text-center">
            <IconByName name="calendar" className="mx-auto mb-3 h-10 w-10 text-fg-muted" />
            <p className="text-fg-muted">No hay eventos programados para {MONTHS[selectedMonth]}.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl"
          >
            <IconByName name="download" className="h-5 w-5" />
            Descargar calendario completo (PDF)
          </button>
        </div>
      </section>
    </div>
  );
}
