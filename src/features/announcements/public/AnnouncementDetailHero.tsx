import type { AnnouncementExtended } from "@/features/announcements/types/announcement"
import BrandPageHero from "@/features/announcements/shared/BrandPageHero"

const TYPE_COLORS: Record<string, string> = {
  Informativo: "border-public-glass-border bg-public-glass text-public-on-media",
  Urgente: "border-danger/40 bg-danger/20 text-public-on-media",
  Recordatorio: "border-amber-300/40 bg-amber-500/20 text-public-on-media",
  Tarea: "border-info/40 bg-info/20 text-public-on-media",
  General: "border-public-glass-border bg-public-glass text-public-on-media/90",
  Noticia: "border-accent/40 bg-accent/20 text-public-on-media",
}

/** Detail page band: title + meta once; summary lives in the article body. */
export default function AnnouncementDetailHero({
  announcement,
}: {
  announcement: AnnouncementExtended
}) {
  const typeColor = TYPE_COLORS[announcement.type ?? ""] ?? TYPE_COLORS.General

  return (
    <BrandPageHero
      size="md"
      eyebrow={announcement.header || announcement.type || "Aviso"}
      title={announcement.title}
      meta={
        <div className="flex flex-col gap-3">
          <ul className="flex list-none flex-wrap gap-2 p-0" aria-label="Etiquetas del aviso">
            {announcement.type ? (
              <li>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase ${typeColor}`}
                >
                  {announcement.type}
                </span>
              </li>
            ) : null}
            {announcement.importante ? (
              <li>
                <span
                  className="rounded-full border border-danger/40 bg-danger/25 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase text-public-on-media"
                  role="status"
                >
                  Importante
                </span>
              </li>
            ) : null}
            {announcement.headerAlert?.enabled ? (
              <li>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/20 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase text-public-on-media">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
                  </span>
                  {announcement.headerAlert.label ?? "Aviso urgente"}
                </span>
              </li>
            ) : null}
          </ul>

          {(announcement.fecha || announcement.autor) && (
            <p className="flex flex-wrap items-center gap-1.5 font-sans text-sm text-public-on-media-muted">
              {announcement.fecha ? (
                <time dateTime={announcement.fecha}>{announcement.fecha}</time>
              ) : null}
              {announcement.fecha && announcement.autor ? <span aria-hidden>·</span> : null}
              {announcement.autor ? (
                <span>
                  <span className="sr-only">Autor: </span>
                  {announcement.autor}
                </span>
              ) : null}
            </p>
          )}
        </div>
      }
    />
  )
}
