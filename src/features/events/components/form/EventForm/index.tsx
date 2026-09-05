"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/Button"
import GenericHeader from "@/components/ui/GenericHeader"
import { FloatingInput, FloatingTextarea } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"
import { IconByName } from "@/components/ui/icons"
import { SectionTitle, ToggleChip, } from "@/features/announcements/components/form/AnnouncementForm/form-ui"
import ContentBlocksEditor from "@/features/announcements/components/form/AnnouncementForm/ContentBlocksEditor"
import { isAnnouncementPublished, type PublishAction } from "@/features/announcements/lib/announcement-display"
import { getGalleries, type GalleryRawItem } from "@/features/gallery"
import { globalToast } from "@/lib/toast"
import { createEvent, getEvent, updateEvent } from "@/features/events/services/admin"
import { eventSchema, EVENT_FORM_DEFAULTS, type EventFormValues, } from "@/features/events/validations/event.schema"
import { EVENT_TYPES } from "@/features/events/types/event"
import EventFormSkeleton from "@/features/events/components/skeletons/EventFormSkeleton"
import EventCoverSection from "./CoverSection"
import { buildEventPayload, mapEventToFormValues } from "./map-event"

type Props = {
  editId?: string
}

export default function EventForm({ editId }: Props = {}) {
  const router = useRouter()
  const isEditing = Boolean(editId)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(Boolean(editId))
  const [loadedPublishedAt, setLoadedPublishedAt] = useState<string | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)
  const [albums, setAlbums] = useState<GalleryRawItem[] | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: EVENT_FORM_DEFAULTS,
  })

  const important = watch("important")
  const coverSrc = watch("coverSrc") ?? ""
  const galleryId = watch("galleryId")
  const isPublicVisible = isEditing && isAnnouncementPublished(loadedPublishedAt)

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const result = await getGalleries()
          if (!cancelled) setAlbums(result)
        } catch {
          if (!cancelled) setAlbums([])
        }
      })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!editId) return

    let cancelled = false
      ; (async () => {
        try {
          const data = await getEvent(editId)
          if (cancelled) return
          reset(mapEventToFormValues(data))
          setLoadedPublishedAt(data.published_at ?? null)
          setLoadedSlug(data.slug)
        } catch {
          if (!cancelled) {
            globalToast.error("Error", "No se pudo cargar el evento.")
            router.push("/Event")
          }
        } finally {
          if (!cancelled) setIsLoading(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [editId, reset, router])

  async function onSubmit(data: EventFormValues, action: PublishAction) {
    const scheduledAt = data.publishedAt ? new Date(data.publishedAt) : null
    const hasFutureDate =
      scheduledAt !== null && !Number.isNaN(scheduledAt.getTime()) && scheduledAt > new Date()

    if (action === "schedule") {
      if (!data.publishedAt) {
        setError("publishedAt", { message: "Indica fecha y hora para programar el evento." })
        return
      }
      if (!hasFutureDate) {
        setError("publishedAt", { message: "La fecha de programación debe ser futura." })
        return
      }
    }

    if (action === "publish" && hasFutureDate) {
      setError("publishedAt", {
        message: "Para publicar en esa fecha usa «Programar».",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = buildEventPayload(data, action)

      if (isEditing && editId) {
        await updateEvent(editId, payload)
        globalToast.success("Evento actualizado", successMessage(action))
      } else {
        await createEvent(payload)
        globalToast.success("Evento guardado", successMessage(action))
      }

      router.push("/Event")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado."
      globalToast.error("Error al guardar", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <EventFormSkeleton />
  }

  return (
    <div className="space-y-6">
      <GenericHeader
        title={isEditing ? "Editar evento" : "Nuevo evento"}
        description={
          isEditing
            ? "Modifica fechas, lugar y contenido del evento."
            : "Publica una actividad para /eventos y el calendario escolar."
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          {isPublicVisible && loadedSlug ? (
            <Link
              href={`/eventos/${loadedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              Ver público
            </Link>
          ) : null}
          <Button variant="ghost" onClick={() => router.push("/Event")}>
            &larr; Volver a la lista
          </Button>
        </div>
      </GenericHeader>

      <div className="rounded-lg border border-border bg-surface-elevated text-foreground shadow-md">
        <form className="divide-y divide-border" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="px-6 py-7 md:px-8">
            <SectionTitle
              title="Datos del evento"
              description="Título, tipo, fechas y lugar que verá la comunidad."
              icon={<IconByName name="calendarDays" className="h-4.5 w-4.5" />}
            />

            <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
              <FloatingInput
                label="Título"
                required
                placeholder="Ej. Feria de ciencias 2026"
                error={errors.title?.message}
                {...register("title")}
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FloatingSelect
                    label="Tipo"
                    error={errors.type?.message}
                    {...field}
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </FloatingSelect>
                )}
              />

              <FloatingInput
                label="Inicio"
                type="datetime-local"
                required
                error={errors.startsAt?.message}
                {...register("startsAt")}
              />

              <FloatingInput
                label="Fin (opcional)"
                type="datetime-local"
                helperText="Si dura más de un día o tiene hora de cierre."
                error={errors.endsAt?.message}
                {...register("endsAt")}
              />

              <FloatingInput
                label="Lugar"
                placeholder="Patio cívico, aula magna…"
                error={errors.location?.message}
                {...register("location")}
              />

              <FloatingInput
                label="Slug (opcional)"
                placeholder="feria-de-ciencias-2026"
                helperText="Se genera desde el título si lo dejas vacío."
                error={errors.slug?.message}
                {...register("slug")}
              />

              <FloatingInput
                label="Fecha de publicación"
                type="datetime-local"
                helperText="Solo se usa al programar el evento."
                error={errors.publishedAt?.message}
                {...register("publishedAt")}
              />

              <Controller
                name="galleryId"
                control={control}
                render={({ field }) => (
                  <FloatingSelect
                    label="Álbum vinculado (opcional)"
                    helperText="Las fotos del álbum se muestran en el detalle."
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">Sin álbum</option>
                    {(albums ?? []).map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </FloatingSelect>
                )}
              />
            </div>

            {galleryId ? (
              <p className="mt-1 text-xs text-fg-muted">
                También puedes incrustar el álbum en el contenido con un bloque «Álbum vinculado».
              </p>
            ) : null}

            <div className="mt-2">
              <ToggleChip
                checked={important}
                onChange={(value) => setValue("important", value)}
                label="Marcar como importante"
              />
            </div>
          </div>

          <div className="px-6 py-7 md:px-8">
            <SectionTitle
              title="Contenido"
              description="Resumen para listados y bloques para el detalle."
              icon={<IconByName name="list" className="h-4.5 w-4.5" />}
            />

            <FloatingTextarea
              label="Resumen"
              rows={3}
              placeholder="Texto breve para tarjetas y el calendario."
              error={errors.summary?.message}
              {...register("summary")}
            />

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-foreground">
                Contenido extendido (vista de detalle)
              </p>
              <Controller
                name="contentBlocks"
                control={control}
                render={({ field }) => (
                  <ContentBlocksEditor
                    value={field.value ?? []}
                    onChange={field.onChange}
                    mediaCollection="events"
                  />
                )}
              />
            </div>
          </div>

          <Controller
            name="coverSrc"
            control={control}
            render={({ field }) => (
              <EventCoverSection coverSrc={coverSrc} onChange={field.onChange} />
            )}
          />

          <div className="flex flex-col gap-4 rounded-b-2xl bg-surface-muted px-6 py-5 md:px-8">
            <p className="text-xs text-fg-muted">
              Usa <strong className="font-medium">Programar</strong> con fecha futura o{" "}
              <strong className="font-medium">Publicar ahora</strong> para hacerlo visible
              en /eventos y el calendario.
            </p>

            <div className="flex w-full flex-wrap items-center justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push("/Event")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit((data) => onSubmit(data, "draft"))()}
              >
                Guardar borrador
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit((data) => onSubmit(data, "schedule"))()}
              >
                Programar
              </Button>
              <Button
                variant="primary"
                type="button"
                loading={isSubmitting}
                onClick={() => handleSubmit((data) => onSubmit(data, "publish"))()}
              >
                {isEditing ? "Publicar / actualizar" : "Publicar ahora"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function successMessage(action: PublishAction): string {
  if (action === "draft") return "El borrador se guardó correctamente."
  if (action === "schedule") return "El evento quedó programado."
  return "El evento se publicó correctamente."
}
