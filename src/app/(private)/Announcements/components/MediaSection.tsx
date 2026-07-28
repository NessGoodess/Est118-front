import { UseFormRegister, Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import Image from "next/image"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingSelect as FS } from "@/components/ui/FloatingSelect"
import { AnnouncementFormValues } from "@/lib/validations/announcement.schema"
import { SectionTitle, FileDropZone } from "./SharedComponents"

interface Props {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  mediaType: string
  imagePreview: string | null
  videoPreview: string | null
  setImagePreview: (val: string | null) => void
  setVideoPreview: (val: string | null) => void
  handleMediaTypeChange: (value: string) => void
  mediaYoutubeId?: string
}

export function MediaSection({ 
  register, 
  control, 
  errors, 
  mediaType, 
  imagePreview, 
  videoPreview, 
  setImagePreview, 
  setVideoPreview, 
  handleMediaTypeChange,
  mediaYoutubeId
}: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Multimedia"
        description="Imagen, video o enlace de YouTube que acompaña al aviso."
        icon={
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

      <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
        <Controller
          name="mediaType"
          control={control}
          render={({ field }) => (
            <FS
              label="Tipo de multimedia"
              helperText="Imagen subida al servidor, video local o enlace YouTube."
              error={errors.mediaType?.message}
              {...field}
              onChange={(e) => {
                handleMediaTypeChange(e.target.value)
              }}
            >
              <option value="image">Imagen (PNG, JPG, WebP…)</option>
              <option value="video">Video</option>
              <option value="youtube">YouTube</option>
            </FS>
          )}
        />

        <Controller
          name="mediaRatio"
          control={control}
          render={({ field }) => (
            <FS
              label="Proporción (ratio)"
              helperText="4/3 = paisaje ancho · 3/4 = retrato alto · 1/1 = cuadrado"
              error={errors.mediaRatio?.message}
              {...field}
            >
              <option value="4/3">4:3 — Paisaje (ancho)</option>
              <option value="3/4">3:4 — Retrato (alto)</option>
              <option value="4/4">1:1 — Cuadrado</option>
            </FS>
          )}
        />
      </div>

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

      {/* Image upload */}
      {mediaType === "image" && (
        <Controller
          name="mediaFile"
          control={control}
          render={({ field }) => (
            <FileDropZone
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              label="PNG, JPG, WebP, GIF — máx. 5 MB. Se optimizará automáticamente."
              preview={imagePreview}
              error={errors.mediaFile?.message as string | undefined}
              onChange={(file) => {
                field.onChange(file)
                setImagePreview(URL.createObjectURL(file))
              }}
              onClear={() => {
                field.onChange(null)
                setImagePreview(null)
              }}
            />
          )}
        />
      )}

      {/* Video upload or URL */}
      {mediaType === "video" && (
        <div className="space-y-4">
          <Controller
            name="mediaFile"
            control={control}
            render={({ field }) => (
              <FileDropZone
                accept="video/mp4,video/webm,video/ogg"
                label="MP4, WebM, OGG — máx. 50 MB."
                preview={videoPreview}
                error={errors.mediaFile?.message as string | undefined}
                onChange={(file) => {
                  field.onChange(file)
                  setVideoPreview(URL.createObjectURL(file))
                  // We handle clearing URL in component or leave it up to parent
                }}
                onClear={() => {
                  field.onChange(null)
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

      {/* YouTube */}
      {mediaType === "youtube" && (
        <div>
          <FloatingInput
            label="ID del video de YouTube"
            placeholder="dQw4w9WgXcQ"
            helperText='Solo el ID, no la URL completa. Ej: en "youtube.com/watch?v=dQw4w9WgXcQ" el ID es "dQw4w9WgXcQ".'
            error={errors.mediaYoutubeId?.message}
            {...register("mediaYoutubeId")}
          />
          {mediaYoutubeId && (
            <div className="mt-2 overflow-hidden rounded-xl border border-border">
              <Image
                src={`https://img.youtube.com/vi/${mediaYoutubeId}/mqdefault.jpg`}
                alt="Vista previa YouTube"
                width={320}
                height={180}
                className="h-40 w-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
