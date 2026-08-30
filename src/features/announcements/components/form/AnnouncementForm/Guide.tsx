"use client"

import { IconByName } from "@/components/ui/icons"

const STEPS = [
  {
    icon: "fileText" as const,
    title: "Información general",
    body: "Título, tipo e importancia. El encabezado y badge de alerta se derivan del tipo (Urgente muestra alerta). El slug se genera solo si lo dejas vacío.",
  },
  {
    icon: "image" as const,
    title: "Multimedia",
    body: "Imagen, video, YouTube o post de Facebook (elige uno). Con Facebook basta título + tipo + URL del post.",
  },
  {
    icon: "list" as const,
    title: "Detalles",
    body: "Resumen y bloques son opcionales si usas Facebook. Con imagen/video el resumen sigue siendo obligatorio.",
  },
  {
    icon: "link" as const,
    title: "Botones",
    body: "El botón secundario es opcional. “Leer más” siempre lleva al detalle público.",
  },
  {
    icon: "share" as const,
    title: "Publicación",
    body: "Guardar borrador, programar con fecha futura o publicar ahora. Solo los publicados son visibles en el sitio.",
  },
]

export default function AnnouncementFormGuide() {
  return (
    <aside className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm text-foreground">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <IconByName name="info" className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold">Guía rápida</h2>
          <p className="text-[11px] text-fg-muted">Cómo se verá el aviso público</p>
        </div>
      </div>

      <ol className="space-y-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-fg-muted">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <IconByName name={step.icon} className="h-3.5 w-3.5 text-primary" />
                {step.title}
              </div>
              <p className="text-[11px] leading-relaxed text-fg-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-xl bg-primary/5 px-3 py-2.5 text-[11px] leading-relaxed text-fg-muted">
        Abre <span className="font-semibold text-foreground">Vista previa</span> cuando quieras
        revisar la tarjeta del home en un modal (se actualiza con lo que ya escribiste).
      </div>
    </aside>
  )
}
