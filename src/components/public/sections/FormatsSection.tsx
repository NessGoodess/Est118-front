"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IconByName } from "@/components/ui/icons";
import { formatos, type Formato } from "@/lib/data/mockData";
import PublicPageHero from "./PublicPageHero";
import Link from "next/link";

const CATEGORIES = ["Todos", "Académico", "Administrativo", "Justificante", "Solicitud"] as const;

function categoryBadgeClass(categoria: Formato["categoria"]) {
  switch (categoria) {
    case "Académico":
      return "bg-primary-soft text-primary";
    case "Administrativo":
      return "bg-info/10 text-info";
    case "Justificante":
      return "bg-warning/10 text-warning";
    case "Solicitud":
      return "bg-success/10 text-success";
    default:
      return "bg-surface-muted text-fg-muted";
  }
}

export default function FormatsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const filteredFormatos = useMemo(
    () =>
      selectedCategory === "Todos"
        ? formatos
        : formatos.filter((formato) => formato.categoria === selectedCategory),
    [selectedCategory]
  );

  return (
    <div className="min-h-screen bg-surface-app">
      <PublicPageHero
        title="Formatos y Documentos"
        description="Descarga formatos y documentos oficiales de la escuela"
      />

      <section className="sticky top-[var(--public-sticky-top)] z-40 border-b border-border bg-surface-elevated/95 shadow-sm backdrop-blur-md transition-[top] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface-muted text-foreground hover:bg-surface-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredFormatos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormatos.map((formato, index) => (
              <motion.article
                key={formato.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl transition-shadow hover:shadow-2xl"
              >
                <div className="border-b border-border bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-public-on-media">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-public-glass">
                      <IconByName name="fileText" className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryBadgeClass(formato.categoria)}`}
                    >
                      {formato.categoria}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{formato.nombre}</h3>
                </div>

                <div className="p-6">
                  <p className="mb-5 text-sm leading-relaxed text-fg-muted">{formato.descripcion}</p>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-muted p-3">
                      <p className="text-xs text-fg-muted">Tamaño</p>
                      <p className="font-semibold text-foreground">{formato.tamano}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted p-3">
                      <p className="text-xs text-fg-muted">Descargas</p>
                      <p className="font-semibold text-foreground">
                        {formato.descargas.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 flex items-center gap-2 text-xs text-fg-muted">
                    <IconByName name="clock" className="h-4 w-4 shrink-0" />
                    <span>Actualizado: {formato.fechaActualizacion}</span>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary-hover group-hover:shadow-md"
                  >
                    <IconByName name="download" className="h-5 w-5" />
                    Descargar PDF
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-elevated py-16 text-center">
            <IconByName name="fileText" className="mx-auto mb-3 h-10 w-10 text-fg-muted" />
            <p className="text-fg-muted">No hay formatos en esta categoría.</p>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-primary-soft p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconByName name="info" className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-foreground">¿Necesitas ayuda?</h3>
              <p className="mb-3 text-sm leading-relaxed text-fg-muted">
                Si tienes dudas sobre cómo llenar algún formato, acude a servicios escolares de
                lunes a viernes, 8:00 a 14:00.
              </p>
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Ver contacto
                <IconByName name="chevronRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
