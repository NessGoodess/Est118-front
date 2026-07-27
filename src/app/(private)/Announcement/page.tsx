"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"

import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api"
import { getAnnouncement, updateAnnouncement } from "@/lib/services/announcements.service"
import {
  announcementSchema,
  ANNOUNCEMENT_FORM_DEFAULTS,
  ANNOUNCEMENT_TYPES,
  type AnnouncementFormValues,
} from "@/lib/validations/announcement.schema"
import { globalToast } from "@/lib/toast"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingTextarea } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-950/8 text-blue-950">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="my-7 h-px w-full bg-gray-100" />
}

function ToggleChip({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
        checked
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full border-2 transition-colors ${
          checked ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
        }`}
      />
      {label}
    </button>
  )
}

// File drop zone
function FileDropZone({
  accept,
  label,
  preview,
  error,
  onChange,
  onClear,
}: {
  accept: string
  label: string
  preview?: string | null
  error?: string
  onChange: (file: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onChange(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-150 ${
          error
            ? "border-red-300 bg-red-50"
            : dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
        }`}
      >
        {preview ? (
          <>
            {accept.startsWith("image") ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <video src={preview} className="h-32 w-full rounded-lg object-contain" muted />
            )}
            <button
              type="button"
              aria-label="Quitar archivo"
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <svg className={`h-8 w-8 transition-colors ${dragging ? "text-blue-500" : "text-gray-400 group-hover:text-blue-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-center text-xs text-gray-500">
              <span className="font-semibold text-blue-600">Haz clic</span> o arrastra el archivo aquí
            </p>
            <p className="text-[11px] text-gray-400">{label}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onChange(file)
          }}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5zm.75 5.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

type AnnouncementResponse = {
  title: string
  header?: string | null
  slug?: string | null
  header_alert_enabled: boolean
  header_alert_label?: string | null
  content_type: "text" | "list"
  content_text?: string | null
  content_items?: string[] | string | null

  secondary_button_enabled: boolean
  secondary_button_label?: string | null
  secondary_button_href?: string | null
  media_type: "image" | "video" | "youtube"
  media_alt?: string | null
  media_ratio?: "4/3" | "3/4" | "4/4"
  media_src?: string | null
  media_youtube_id?: string | null
  published_at?: string | null
  author?: string | null
  type: string
  important: boolean
  summary?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get("id")
  const isEditing = Boolean(editId)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: ANNOUNCEMENT_FORM_DEFAULTS,
  })

  // Optimizing watch usage
  const mediaType = watch("mediaType")
  const contentType = watch("contentType")
  const headerAlertEnabled = watch("headerAlertEnabled")
  const secondaryButtonEnabled = watch("secondaryButtonEnabled")

  // Fix memory leak with object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview)
      if (videoPreview && videoPreview.startsWith("blob:")) URL.revokeObjectURL(videoPreview)
    }
  }, [imagePreview, videoPreview])

  // ── Fetch for Edit ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isEditing || !editId) return

    async function fetchAnnouncement() {
      try {
        const data = (await getAnnouncement(editId as string)) as AnnouncementResponse
        
        reset({
          title: data.title,
          header: data.header || "",
          slug: data.slug || "",
          headerAlertEnabled: Boolean(data.header_alert_enabled),
          headerAlertLabel: data.header_alert_label || "",
          contentType: data.content_type || "text",
          contentText: data.content_text || "",
          contentItems: Array.isArray(data.content_items) 
            ? data.content_items.join("\n") 
            : (data.content_items || ""),

          secondaryButtonEnabled: Boolean(data.secondary_button_enabled),
          secondaryButtonLabel: data.secondary_button_label || "",
          secondaryButtonHref: data.secondary_button_href || "",
          mediaType: data.media_type || "image",
          mediaAlt: data.media_alt || "",
          mediaRatio: data.media_ratio || "4/3",
          mediaYoutubeId: data.media_youtube_id || "",
          publishedAt: data.published_at ? data.published_at.substring(0, 16) : undefined,
          author: data.author || "",
          type: (data.type as AnnouncementFormValues['type']) || "General",
          important: Boolean(data.important),
          summary: data.summary || "",
        })

        if (data.media_type === "image" && data.media_src && !data.media_src.includes("youtube")) {
          setImagePreview(data.media_src)
        } else if (data.media_type === "video" && data.media_src && !data.media_src.includes("youtube")) {
          setVideoPreview(data.media_src)
        }
      } catch {
        globalToast.error("Error", "No se pudo cargar el aviso para edición.")
        router.push("/Announcement/list")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncement()
  }, [isEditing, editId, reset, router])

  // ── Helper ───────────────────────────────────────────────────────────────
  
  function handleMediaTypeChange(value: string) {
    setValue("mediaType", value as AnnouncementFormValues['mediaType'])
    setValue("mediaFile", null)
    setValue("mediaVideoUrl", "")
    setImagePreview(null)
    setVideoPreview(null)
  }

  function buildAnnouncementFormData(data: AnnouncementFormValues) {
    const fd = new FormData()

    fd.append("title", data.title)
    fd.append("header", data.header || "Comunicado")
    if (data.slug) fd.append("slug", data.slug)
    
    // Explicit conversion of boolean to string as '1'/'0' or 'true'/'false'.
    // Laravel casts this back.
    fd.append("header_alert_enabled", data.headerAlertEnabled ? "1" : "0")
    if (data.headerAlertLabel) fd.append("header_alert_label", data.headerAlertLabel)
    
    fd.append("content_type", data.contentType)
    
    if (data.contentType === "text" && data.contentText) {
      fd.append("content_text", data.contentText)
    }
    
    if (data.contentType === "list" && data.contentItems) {
      data.contentItems
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean)
        .forEach((item) => fd.append("content_items[]", item))
    }
    

    
    fd.append("secondary_button_enabled", data.secondaryButtonEnabled ? "1" : "0")
    if (data.secondaryButtonLabel) fd.append("secondary_button_label", data.secondaryButtonLabel)
    if (data.secondaryButtonHref) fd.append("secondary_button_href", data.secondaryButtonHref)
    
    fd.append("media_type", data.mediaType)
    fd.append("media_alt", data.mediaAlt)
    fd.append("media_ratio", data.mediaRatio)

    if (data.mediaType === "youtube" && data.mediaYoutubeId) {
      fd.append("media_youtube_id", data.mediaYoutubeId)
    } else if (data.mediaFile instanceof File) {
      fd.append("media_file", data.mediaFile)
    } else if (data.mediaVideoUrl) {
      fd.append("media_src", data.mediaVideoUrl)
    }

    if (data.publishedAt) fd.append("published_at", data.publishedAt)
    if (data.author) fd.append("author", data.author)
    fd.append("type", data.type)
    fd.append("important", data.important ? "1" : "0")
    
    if (data.summary) fd.append("summary", data.summary)

    return fd
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function onSubmit(data: AnnouncementFormValues) {
    setIsSubmitting(true)
    try {
      const fd = buildAnnouncementFormData(data)

      if (isEditing && editId) {
        await updateAnnouncement(editId, fd)
        globalToast.success("Aviso actualizado", "El aviso se actualizó correctamente.")
        router.push("/Announcement/list")
      } else {
        await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        globalToast.success("Aviso creado", "El aviso se publicó correctamente.")
        reset(ANNOUNCEMENT_FORM_DEFAULTS)
        setImagePreview(null)
        setVideoPreview(null)
      }
    } catch (err: unknown) {
      const apiError = handleApiError(err)
      globalToast.error("Error al guardar", apiError.message ?? "Ocurrió un error inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p>Cargando información del aviso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">

        {/* Page header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                {isEditing ? "Editar aviso" : "Nuevo aviso"}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditing ? "Modifica los detalles del comunicado." : "Crea y publica un comunicado para la comunidad escolar."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/Announcement/list")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            &larr; Volver a la lista
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.07)] text-black">
          <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-100">

            {/* ── SECTION 1: General ─────────────────────────────────────────── */}
            <div className="px-6 py-7 md:px-8">
              <SectionTitle
                title="Información general"
                description="Datos principales del aviso que se muestran en la tarjeta de listado y en la vista completa."
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />

              <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
                <FloatingInput
                  label="Título del aviso"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />
                <FloatingInput
                  label="Encabezado (header)"
                  placeholder="Comunicado, Calendario, Noticias…"
                  helperText='Texto destacado encima del título. Ej: "Comunicado"'
                  error={errors.header?.message}
                  {...register("header")}
                />
                <FloatingInput
                  label="Slug (URL amigable)"
                  placeholder="mi-aviso-importante"
                  helperText="Déjalo vacío para generarlo automáticamente."
                  error={errors.slug?.message}
                  {...register("slug")}
                />
                <FloatingInput
                  label="Autor"
                  placeholder="Dirección, Comunicación Escolar…"
                  error={errors.author?.message}
                  {...register("author")}
                />
              </div>

              <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FloatingSelect
                      label="Tipo de aviso"
                      required
                      error={errors.type?.message}
                      helperText="Clasifica el aviso para facilitar su filtrado."
                      {...field}
                    >
                      {ANNOUNCEMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </FloatingSelect>
                  )}
                />
                <FloatingInput
                  label="Fecha y hora de publicación"
                  type="datetime-local"
                  helperText="Déjalo vacío para publicar ahora mismo."
                  error={errors.publishedAt?.message}
                  className="[&_label]:top-0! [&_label]:text-xs! [&_label]:font-semibold! [&_label]:bg-white! [&_label]:px-2! [&_label]:-translate-y-1/2!"
                  {...register("publishedAt")}
                />
              </div>

              {/* Toggles */}
              <div className="mt-1 flex flex-wrap gap-2.5">
                <Controller
                  name="important"
                  control={control}
                  render={({ field }) => (
                    <ToggleChip
                      checked={field.value}
                      onChange={field.onChange}
                      label="Marcar como importante"
                    />
                  )}
                />
                <Controller
                  name="headerAlertEnabled"
                  control={control}
                  render={({ field }) => (
                    <ToggleChip
                      checked={field.value}
                      onChange={field.onChange}
                      label="Mostrar badge de alerta"
                    />
                  )}
                />
              </div>

              {headerAlertEnabled && (
                <div className="mt-4">
                  <FloatingInput
                    label="Texto del badge de alerta"
                    placeholder="Importante, Fechas oficiales, Urgente…"
                    error={errors.headerAlertLabel?.message}
                    {...register("headerAlertLabel")}
                  />
                </div>
              )}
            </div>

            {/* ── SECTION 2: Contenido ───────────────────────────────────────── */}
            <div className="px-6 py-7 md:px-8">
              <SectionTitle
                title="Contenido"
                description="Cuerpo del aviso que se muestra en la vista completa."
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h12M4 18h8" />
                  </svg>
                }
              />

              <Controller
                name="contentType"
                control={control}
                render={({ field }) => (
                  <FloatingSelect
                    label="Tipo de contenido"
                    helperText="Elige si el cuerpo es un párrafo o una lista de puntos."
                    error={errors.contentType?.message}
                    {...field}
                  >
                    <option value="text">Texto libre</option>
                    <option value="list">Lista de puntos</option>
                  </FloatingSelect>
                )}
              />

              {contentType === "text" && (
                <FloatingTextarea
                  label="Contenido"
                  rows={5}
                  error={errors.contentText?.message}
                  {...register("contentText")}
                />
              )}

              {contentType === "list" && (
                <FloatingTextarea
                  label="Ítems de la lista (un ítem por línea)"
                  rows={5}
                  placeholder={"Primer punto\nSegundo punto\nTercer punto"}
                  helperText="Cada línea se convierte en un ítem de la lista."
                  error={errors.contentItems?.message}
                  {...register("contentItems")}
                />
              )}

              <div className="mt-2">
                <FloatingTextarea
                  label="Resumen corto"
                  rows={3}
                  placeholder="Texto breve que aparece en la tarjeta de listado (máx. 300 caracteres)."
                  helperText="Si lo dejas vacío se usará el inicio del contenido."
                  error={errors.summary?.message}
                  {...register("summary")}
                />
              </div>
            </div>

            {/* ── SECTION 3: Media ──────────────────────────────────────────── */}
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
                    <FloatingSelect
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
                    </FloatingSelect>
                  )}
                />

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
                          setValue("mediaVideoUrl", "")
                        }}
                        onClear={() => {
                          field.onChange(null)
                          setVideoPreview(null)
                        }}
                      />
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400">o usa una URL</span>
                    <div className="h-px flex-1 bg-gray-200" />
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
                  {watch("mediaYoutubeId") && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
                    <Image
                        src={`https://img.youtube.com/vi/${watch("mediaYoutubeId")}/mqdefault.jpg`}
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

            {/* ── SECTION 4: Botones ────────────────────────────────────────── */}
            <div className="px-6 py-7 md:px-8">
              <SectionTitle
                title="Botones de acción"
                description="Configura los botones que aparecerán al pie del aviso para dirigir al usuario."
                icon={
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                }
              />


              <Divider />

              <div className="mb-4 flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Botón secundario
                </p>
                <Controller
                  name="secondaryButtonEnabled"
                  control={control}
                  render={({ field }) => (
                    <ToggleChip
                      checked={field.value}
                      onChange={field.onChange}
                      label={field.value ? "Habilitado" : "Deshabilitado"}
                    />
                  )}
                />
              </div>

              {secondaryButtonEnabled && (
                <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
                  <FloatingInput
                    label="Texto del botón secundario"
                    error={errors.secondaryButtonLabel?.message}
                    {...register("secondaryButtonLabel")}
                  />
                  <FloatingInput
                    label="URL del botón secundario"
                    error={errors.secondaryButtonHref?.message}
                    {...register("secondaryButtonHref")}
                  />
                </div>
              )}
            </div>

            {/* ── Submit ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 rounded-b-2xl bg-gray-50 px-6 py-5 md:px-8">
              <p className="hidden text-xs text-gray-400 md:block">
                Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
              </p>
              
              <div className="flex w-full items-center justify-end gap-3 md:w-auto">
                <button
                  type="button"
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                  onClick={() => {
                    reset(ANNOUNCEMENT_FORM_DEFAULTS)
                    setImagePreview(null)
                    setVideoPreview(null)
                    if (isEditing) router.push("/Announcement/list")
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-7 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-900 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Guardando…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditing ? "Actualizar aviso" : "Publicar aviso"}
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}