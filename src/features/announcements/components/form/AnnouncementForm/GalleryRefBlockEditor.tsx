"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import { getGalleries, type GalleryRawItem } from "@/features/gallery"
import type { AnnouncementContentBlockGalleryRef } from "@/features/announcements/types/announcement"

type Props = {
  block: AnnouncementContentBlockGalleryRef
  onChange: (block: AnnouncementContentBlockGalleryRef) => void
}

/** Picks an existing album to embed in the notice detail. */
export default function GalleryRefBlockEditor({ block, onChange }: Props) {
  const [albums, setAlbums] = useState<GalleryRawItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await getGalleries()
        if (!cancelled) setAlbums(result)
      } catch {
        if (!cancelled) {
          setAlbums([])
          setError("No se pudieron cargar las galerías.")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const selected = albums?.find((album) => album.id === block.galleryId)

  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
          Álbum vinculado
        </span>
        <select
          value={block.galleryId || ""}
          onChange={(e) => onChange({ ...block, galleryId: Number(e.target.value) })}
          disabled={albums === null}
          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
        >
          <option value="">
            {albums === null ? "Cargando galerías…" : "Selecciona un álbum"}
          </option>
          {(albums ?? []).map((album) => (
            <option key={album.id} value={album.id}>
              {album.title} · {album.items_count ?? 0} fotos
              {album.published_at ? "" : " (borrador)"}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
            Título en el aviso (opcional)
          </span>
          <input
            value={block.title ?? ""}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            placeholder="Se usa el título del álbum si lo dejas vacío"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
            Presentación
          </span>
          <div className="flex gap-2">
            {(
              [
                { value: "carousel", label: "Carrusel", icon: "carousel" },
                { value: "grid", label: "Cuadrícula", icon: "grid" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...block, layout: option.value })}
                aria-pressed={block.layout === option.value}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  block.layout === option.value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface-elevated text-fg-muted hover:border-primary/40"
                }`}
              >
                <IconByName name={option.icon} className="h-3.5 w-3.5" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <p className="flex items-center gap-1 text-xs text-danger">
          <IconByName name="alert" className="h-3 w-3 shrink-0" />
          {error}
        </p>
      ) : null}

      {albums?.length === 0 && !error ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-fg-muted">
          Aún no hay álbumes.{" "}
          <Link href="/Gallery/create" className="font-semibold text-primary hover:underline">
            Crea el primero
          </Link>
          .
        </p>
      ) : null}

      {selected ? (
        <p className="rounded-lg border border-border bg-surface-muted/40 px-3 py-2 text-xs text-fg-muted">
          Se mostrarán las {selected.items_count ?? 0} fotos de{" "}
          <strong className="font-semibold text-foreground">{selected.title}</strong> con un enlace
          al álbum completo.
          {selected.published_at ? null : (
            <span className="ml-1 text-warning-foreground">
              El álbum está en borrador: publícalo para que se vea en el sitio.
            </span>
          )}
        </p>
      ) : null}
    </div>
  )
}
