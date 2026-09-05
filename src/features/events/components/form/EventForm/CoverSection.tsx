"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { IconByName } from "@/components/ui/icons"
import { Button } from "@/components/ui/Button"
import { SectionTitle } from "@/features/announcements/components/form/AnnouncementForm/form-ui"
import { MEDIA_UPLOAD_MAX_BYTES, uploadPublicMedia } from "@/features/media"

type Props = {
  coverSrc: string
  onChange: (src: string) => void
}

export default function EventCoverSection({ coverSrc, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return

    if (file.size > MEDIA_UPLOAD_MAX_BYTES) {
      setError("La imagen supera los 5 MB permitidos.")
      return
    }

    setError(null)
    setUploading(true)
    try {
      const [uploaded] = await uploadPublicMedia([file], "events")
      if (uploaded) onChange(uploaded.src)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la portada.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Portada"
        description="Imagen opcional que se muestra en el detalle del evento."
        icon={<IconByName name="image" className="h-4.5 w-4.5" />}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files)}
      />

      {coverSrc ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-16/9 w-full bg-surface-muted">
            <Image src={coverSrc} alt="Portada del evento" fill className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border bg-surface-muted/60 px-3 py-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Cambiar
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              Quitar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-10 text-sm text-fg-muted transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <IconByName name="upload" className="h-6 w-6" />
          {uploading ? "Subiendo…" : "Subir portada"}
        </button>
      )}

      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
