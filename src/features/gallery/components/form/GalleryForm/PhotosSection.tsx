"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { IconByName } from "@/components/ui/icons"
import { SectionTitle } from "@/features/announcements/components/form/AnnouncementForm/form-ui"
import { MEDIA_UPLOAD_MAX_BYTES, uploadPublicMedia } from "@/features/media"
import { GALLERY_RATIOS, type GalleryPhotoFormValue } from "@/features/gallery/validations/gallery.schema"

type Props = {
  photos: GalleryPhotoFormValue[]
  coverSrc: string
  error?: string
  onChange: (photos: GalleryPhotoFormValue[]) => void
  onCoverChange: (src: string) => void
}

const RATIO_LABEL: Record<(typeof GALLERY_RATIOS)[number], string> = {
  "4/3": "4:3 paisaje",
  "3/4": "3:4 retrato",
  "1/1": "1:1 cuadrada",
  "16/9": "16:9 panorámica",
}

function altFromFileName(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim()
}

export default function GalleryFormPhotosSection({
  photos,
  coverSrc,
  error,
  onChange,
  onCoverChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return

    setUploadError(null)

    const tooBig = files.find((file) => file.size > MEDIA_UPLOAD_MAX_BYTES)
    if (tooBig) {
      setUploadError(`"${tooBig.name}" supera los 5 MB permitidos por foto.`)
      return
    }

    setUploading(true)
    try {
      // The API caps each request; upload in chunks so large albums still work.
      const chunks: File[][] = []
      for (let i = 0; i < files.length; i += 20) chunks.push(files.slice(i, i + 20))

      const uploaded = (
        await Promise.all(chunks.map((chunk) => uploadPublicMedia(chunk, "galleries")))
      ).flat()

      onChange([
        ...photos,
        ...uploaded.map((file) => ({
          src: file.src,
          alt: altFromFileName(file.name),
          caption: "",
          ratio: "4/3" as const,
        })),
      ])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "No se pudieron subir las fotos.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const movePhoto = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= photos.length) return
    const next = [...photos]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const removePhoto = (index: number) => {
    const removed = photos[index]
    onChange(photos.filter((_, i) => i !== index))
    if (removed.src === coverSrc) onCoverChange("")
  }

  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Fotos del álbum"
        description="Sube varias imágenes a la vez. El orden define cómo se muestran en el sitio público."
        icon={<IconByName name="gallery" className="h-4.5 w-4.5" />}
      />

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
        className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-all duration-150 ${
          error || uploadError
            ? "border-danger/40 bg-danger/10"
            : dragging
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface-muted hover:border-primary/40 hover:bg-primary-soft/40"
        }`}
      >
        <IconByName
          name={uploading ? "loader" : "upload"}
          className={`h-8 w-8 ${uploading ? "animate-spin text-primary" : "text-fg-muted"}`}
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
          PNG, JPG, WebP o GIF — máx. 5 MB por foto. Se convierten a WebP automáticamente.
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

      {(uploadError || error) && (
        <p className="mt-2 flex items-center gap-1 text-xs text-danger">
          <IconByName name="alert" className="h-3 w-3 shrink-0" />
          {uploadError ?? error}
        </p>
      )}

      {photos.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {photos.map((photo, index) => {
            const isCover = coverSrc ? photo.src === coverSrc : index === 0

            return (
              <li
                key={`${photo.src}-${index}`}
                className={`flex gap-3 rounded-lg border p-2 transition-colors ${
                  isCover ? "border-primary bg-primary-soft/40" : "border-border bg-surface-elevated"
                }`}
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" />
                  <span className="absolute left-1 top-1 rounded bg-brand-950/70 px-1.5 font-mono text-[10px] text-public-on-media">
                    {index + 1}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <input
                    value={photo.alt}
                    onChange={(e) => {
                      const next = [...photos]
                      next[index] = { ...photo, alt: e.target.value }
                      onChange(next)
                    }}
                    className="w-full rounded-md border border-border bg-surface-app px-2 py-1.5 text-xs"
                    placeholder="Texto alternativo (requerido)"
                  />
                  <input
                    value={photo.caption ?? ""}
                    onChange={(e) => {
                      const next = [...photos]
                      next[index] = { ...photo, caption: e.target.value }
                      onChange(next)
                    }}
                    className="w-full rounded-md border border-border bg-surface-app px-2 py-1.5 text-xs"
                    placeholder="Pie de foto (opcional)"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={photo.ratio}
                      onChange={(e) => {
                        const next = [...photos]
                        next[index] = {
                          ...photo,
                          ratio: e.target.value as GalleryPhotoFormValue["ratio"],
                        }
                        onChange(next)
                      }}
                      className="rounded-md border border-border bg-surface-app px-2 py-1 text-[11px]"
                    >
                      {GALLERY_RATIOS.map((ratio) => (
                        <option key={ratio} value={ratio}>
                          {RATIO_LABEL[ratio]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => onCoverChange(photo.src)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        isCover
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-fg-muted hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {isCover ? "Portada" : "Usar como portada"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-0.5">
                  <button
                    type="button"
                    aria-label="Mover antes"
                    onClick={() => movePhoto(index, -1)}
                    className="rounded px-1.5 py-0.5 text-xs text-fg-muted hover:bg-surface-muted"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Mover después"
                    onClick={() => movePhoto(index, 1)}
                    className="rounded px-1.5 py-0.5 text-xs text-fg-muted hover:bg-surface-muted"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label="Quitar foto"
                    onClick={() => removePhoto(index)}
                    className="rounded px-1.5 py-0.5 text-danger hover:bg-danger/10"
                  >
                    <IconByName name="x" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-border px-3 py-5 text-center text-xs text-fg-muted">
          El álbum aún no tiene fotos.
        </p>
      )}
    </div>
  )
}
