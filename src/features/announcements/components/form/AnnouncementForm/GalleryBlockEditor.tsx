"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconByName } from "@/components/ui/icons"
import { Button } from "@/components/ui/Button"
import {
  GALLERY_BLOCK_MAX_PHOTOS,
  MEDIA_UPLOAD_BATCH_LIMIT,
  MEDIA_UPLOAD_MAX_BYTES,
  uploadPublicMedia,
  type MediaCollection,
} from "@/features/media"
import { createGallery } from "@/features/gallery"
import { globalToast } from "@/lib/toast"
import type {
  AnnouncementContentBlockGallery,
  AnnouncementGalleryImage,
} from "@/features/announcements/types/announcement"

type Props = {
  block: AnnouncementContentBlockGallery
  onChange: (block: AnnouncementContentBlockGallery) => void
  collection?: MediaCollection
}

/** "IMG_2024_feria.jpg" → "IMG 2024 feria" as a starting alt text. */
function altFromFileName(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim()
}

export default function GalleryBlockEditor({
  block,
  onChange,
  collection = "announcements",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [savingAlbum, setSavingAlbum] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [createdAlbumId, setCreatedAlbumId] = useState<number | null>(null)

  const images = block.images ?? []

  const updateImages = (next: AnnouncementGalleryImage[]) => {
    onChange({ ...block, images: next })
  }

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return

    setError(null)

    const remaining = GALLERY_BLOCK_MAX_PHOTOS - images.length
    if (remaining <= 0) {
      setError(`Máximo ${GALLERY_BLOCK_MAX_PHOTOS} fotos por bloque.`)
      return
    }

    const tooBig = files.find((file) => file.size > MEDIA_UPLOAD_MAX_BYTES)
    if (tooBig) {
      setError(`"${tooBig.name}" supera los 5 MB permitidos por foto.`)
      return
    }

    const batch = files.slice(0, remaining)
    setUploading(true)

    try {
      const chunks: File[][] = []
      for (let i = 0; i < batch.length; i += MEDIA_UPLOAD_BATCH_LIMIT) {
        chunks.push(batch.slice(i, i + MEDIA_UPLOAD_BATCH_LIMIT))
      }
      const uploaded = (
        await Promise.all(chunks.map((chunk) => uploadPublicMedia(chunk, collection)))
      ).flat()
      updateImages([
        ...images,
        ...uploaded.map((file) => ({
          src: file.src,
          alt: altFromFileName(file.name),
          caption: "",
        })),
      ])

      if (files.length > batch.length) {
        setError(
          `Se subieron ${batch.length} fotos; el bloque admite hasta ${GALLERY_BLOCK_MAX_PHOTOS}.`
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron subir las fotos.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    updateImages(next)
  }

  const saveAsAlbum = async () => {
    if (images.length === 0) {
      setError("Agrega al menos una foto antes de crear el álbum.")
      return
    }

    const title = (block.title ?? "").trim() || "Álbum desde aviso"
    setError(null)
    setSavingAlbum(true)

    try {
      const album = await createGallery({
        title,
        category: "Académico",
        featured: false,
        publish_action: "publish",
        items: images.map((image, index) => ({
          media_src: image.src,
          alt: image.alt.trim() || `Foto ${index + 1}`,
          caption: image.caption?.trim() || undefined,
          ratio: "4/3",
        })),
      })

      globalToast.success(
        "Álbum creado",
        "Ya está publicado en Galerías. Puedes seguir usando estas fotos aquí o vincular el álbum."
      )
      setCreatedAlbumId(album.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el álbum.")
    } finally {
      setSavingAlbum(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
            Título del bloque (opcional)
          </span>
          <input
            value={block.title ?? ""}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            placeholder="Ej. Feria de ciencias 2026"
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

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 transition-all duration-150 ${
          dragging
            ? "border-primary bg-primary-soft"
            : "border-border bg-surface-muted hover:border-primary/40 hover:bg-primary-soft/40"
        }`}
      >
        <IconByName
          name={uploading ? "loader" : "upload"}
          className={`h-7 w-7 ${uploading ? "animate-spin text-primary" : "text-fg-muted"}`}
        />
        <p className="text-center text-xs text-fg-muted">
          {uploading ? (
            "Subiendo y optimizando fotos…"
          ) : (
            <>
              <span className="font-semibold text-primary">Haz clic</span> o arrastra varias fotos
            </>
          )}
        </p>
        <p className="text-[11px] text-fg-muted">
          PNG, JPG, WebP o GIF — máx. 5 MB c/u · hasta {GALLERY_BLOCK_MAX_PHOTOS} fotos
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error ? (
        <p className="flex items-center gap-1 text-xs text-danger">
          <IconByName name="alert" className="h-3 w-3 shrink-0" />
          {error}
        </p>
      ) : null}

      {images.length > 0 ? (
        <ul className="space-y-2">
          {images.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              className="flex gap-3 rounded-lg border border-border bg-surface-elevated p-2"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                <span className="absolute left-1 top-1 rounded bg-brand-950/70 px-1.5 font-mono text-[10px] text-public-on-media">
                  {index + 1}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <input
                  value={image.alt}
                  onChange={(e) => {
                    const next = [...images]
                    next[index] = { ...image, alt: e.target.value }
                    updateImages(next)
                  }}
                  className="w-full rounded-md border border-border bg-surface-app px-2 py-1.5 text-xs"
                  placeholder="Texto alternativo (accesibilidad)"
                />
                <input
                  value={image.caption ?? ""}
                  onChange={(e) => {
                    const next = [...images]
                    next[index] = { ...image, caption: e.target.value }
                    updateImages(next)
                  }}
                  className="w-full rounded-md border border-border bg-surface-app px-2 py-1.5 text-xs"
                  placeholder="Pie de foto (opcional)"
                />
              </div>

              <div className="flex flex-col justify-center gap-0.5">
                <button
                  type="button"
                  aria-label="Mover antes"
                  onClick={() => moveImage(index, -1)}
                  className="rounded px-1.5 py-0.5 text-xs text-fg-muted hover:bg-surface-muted"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Mover después"
                  onClick={() => moveImage(index, 1)}
                  className="rounded px-1.5 py-0.5 text-xs text-fg-muted hover:bg-surface-muted"
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Quitar foto"
                  onClick={() => updateImages(images.filter((_, i) => i !== index))}
                  className="rounded px-1.5 py-0.5 text-danger hover:bg-danger/10"
                >
                  <IconByName name="x" className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-fg-muted">
          Aún no hay fotos en este bloque.
        </p>
      )}

      {images.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={savingAlbum}
            disabled={uploading}
            onClick={() => void saveAsAlbum()}
          >
            Crear galería desde estas fotos
          </Button>
          {createdAlbumId ? (
            <Link
              href={`/Gallery/${createdAlbumId}/edit`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Editar el álbum creado
            </Link>
          ) : (
            <p className="text-[11px] text-fg-muted">
              Crea un álbum reutilizable en Galerías sin quitar las fotos de este aviso.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
