"use client"

import Image from "next/image"
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"
import { IconByName } from "@/components/ui/icons"
import {
  MEDIA_POSITIONS,
  type AnnouncementFormValues,
} from "@/features/announcements/validations/announcement.schema"
import { FileDropZone, SectionTitle } from "./form-ui"

type Props = {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  setValue: UseFormSetValue<AnnouncementFormValues>
  watch: UseFormWatch<AnnouncementFormValues>
  mediaType: AnnouncementFormValues["mediaType"]
  imagePreview: string | null
  videoPreview: string | null
  setImagePreview: (url: string | null) => void
  setVideoPreview: (url: string | null) => void
  onMediaTypeChange: (value: string) => void
}

export default function AnnouncementFormMediaSection({
  register,
  control,
  errors,
  setValue,
  watch,
  mediaType,
  imagePreview,
  videoPreview,
  setImagePreview,
  setVideoPreview,
  onMediaTypeChange,
}: Props) {
  const youtubeId = watch("mediaYoutubeId")
  const existingMediaSrc = watch("existingMediaSrc")
  const imagePreviewSrc = imagePreview || (mediaType === "image" ? existingMediaSrc : null)
  const videoPreviewSrc = videoPreview || (mediaType === "video" ? existingMediaSrc : null)
  const isFacebook = mediaType === "facebook"

  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Multimedia"
        description="Imagen, video, YouTube o un post de Facebook como contenido principal (elige uno)."
        icon={<IconByName name="image" className="h-4.5 w-4.5" />}
      />

      <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
        <Controller
          name="mediaType"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              label="Tipo de multimedia"
              helperText="Facebook reemplaza imagen/video: el post es el contenido principal."
              error={errors.mediaType?.message}
              {...field}
              onChange={(e) => onMediaTypeChange(e.target.value)}
            >
              <option value="image">Imagen (PNG, JPG, WebP…)</option>
              <option value="video">Video</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Post de Facebook</option>
            </FloatingSelect>
          )}
        />

        {!isFacebook ? (
          <>
            <Controller
              name="mediaRatio"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  label="Proporción (ratio)"
                  helperText="4/3 = paisaje ancho · 3/4 = retrato alto · 1/1 = cuadrado"
                  error={errors.mediaRatio?.message}
                  {...field}
                >
                  <option value="4/3">4:3 — Paisaje (ancho)</option>
                  <option value="3/4">3:4 — Retrato (alto)</option>
                  <option value="4/4">1:1 — Cuadrado</option>
                </FloatingSelect>
              )}
            />

            <Controller
              name="mediaPosition"
              control={control}
              render={({ field }) => (
                <FloatingSelect
                  label="Posición de la media"
                  helperText="Izquierda o derecha en tarjetas y detalle."
                  error={errors.mediaPosition?.message}
                  {...field}
                >
                  {MEDIA_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos === "left" ? "Izquierda" : "Derecha"}
                    </option>
                  ))}
                </FloatingSelect>
              )}
            />
          </>
        ) : null}
      </div>

      {isFacebook ? (
        <div className="mt-2">
          <FloatingInput
            label="URL del post de Facebook"
            required
            placeholder="https://www.facebook.com/…/posts/…"
            helperText="Con título + tipo basta. El post se muestra como media principal en el detalle."
            error={errors.facebookPostUrl?.message}
            {...register("facebookPostUrl")}
          />
        </div>
      ) : (
        <>
          <div className="mb-5">
            <FloatingInput
              label="Texto alternativo (alt)"
              required
              placeholder="Descripción breve de la imagen o video para accesibilidad"
              helperText="Se muestra si la imagen no carga y es leído por lectores de pantalla."
              error={errors.mediaAlt?.message}
              {...register("mediaAlt")}
            />
          </div>

          {mediaType === "image" && (
            <Controller
              name="mediaFile"
              control={control}
              render={({ field }) => (
                <FileDropZone
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  label="PNG, JPG, WebP, GIF — máx. 5 MB. Se optimizará automáticamente."
                  preview={imagePreviewSrc}
                  error={errors.mediaFile?.message as string | undefined}
                  onChange={(file) => {
                    field.onChange(file)
                    setValue("existingMediaSrc", "")
                    setImagePreview(URL.createObjectURL(file))
                  }}
                  onClear={() => {
                    field.onChange(null)
                    setValue("existingMediaSrc", "")
                    setImagePreview(null)
                  }}
                />
              )}
            />
          )}

          {mediaType === "video" && (
            <div className="space-y-4">
              <Controller
                name="mediaFile"
                control={control}
                render={({ field }) => (
                  <FileDropZone
                    accept="video/mp4,video/webm,video/ogg"
                    label="MP4, WebM, OGG — máx. 50 MB."
                    preview={videoPreviewSrc}
                    error={errors.mediaFile?.message as string | undefined}
                    onChange={(file) => {
                      field.onChange(file)
                      setValue("existingMediaSrc", "")
                      setVideoPreview(URL.createObjectURL(file))
                      setValue("mediaVideoUrl", "")
                    }}
                    onClear={() => {
                      field.onChange(null)
                      setValue("existingMediaSrc", "")
                      setValue("mediaVideoUrl", "")
                      setVideoPreview(null)
                    }}
                  />
                )}
              />
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-muted" />
                <span className="text-xs font-medium text-fg-muted">o usa una URL</span>
                <div className="h-px flex-1 bg-surface-muted" />
              </div>
              <FloatingInput
                label="URL del video (enlace externo)"
                type="url"
                placeholder="https://example.com/video.mp4"
                helperText="Si subes un archivo arriba, este campo se ignora."
                error={errors.mediaVideoUrl?.message}
                {...register("mediaVideoUrl")}
              />
            </div>
          )}

          {mediaType === "youtube" && (
            <div>
              <FloatingInput
                label="ID del video de YouTube"
                placeholder="dQw4w9WgXcQ"
                helperText='Solo el ID, no la URL completa. Ej: en "youtube.com/watch?v=dQw4w9WgXcQ" el ID es "dQw4w9WgXcQ".'
                error={errors.mediaYoutubeId?.message}
                {...register("mediaYoutubeId")}
              />
              {youtubeId && (
                <div className="mt-2 overflow-hidden rounded-xl border border-border">
                  <Image
                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    alt="Vista previa YouTube"
                    width={320}
                    height={180}
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
