"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/Button"
import GenericHeader from "@/components/ui/GenericHeader"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"
import { IconByName } from "@/components/ui/icons"
import {
  SectionTitle,
  ToggleChip,
} from "@/features/announcements/components/form/AnnouncementForm/form-ui"
import { isAnnouncementPublished, type PublishAction } from "@/features/announcements/lib/announcement-display"
import { globalToast } from "@/lib/toast"
import {
  createGallery,
  getGallery,
  updateGallery,
} from "@/features/gallery/api/admin"
import {
  gallerySchema,
  GALLERY_FORM_DEFAULTS,
  type GalleryFormValues,
} from "@/features/gallery/validations/gallery.schema"
import { GALLERY_CATEGORIES } from "@/features/gallery/types/gallery"
import GalleryFormSkeleton from "@/features/gallery/components/skeletons/GalleryFormSkeleton"
import PhotosSection from "./PhotosSection"
import { buildGalleryPayload, mapGalleryToFormValues } from "./map-gallery"

type Props = {
  editId?: string
}

export default function GalleryForm({ editId }: Props = {}) {
  const router = useRouter()
  const isEditing = Boolean(editId)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(Boolean(editId))
  const [loadedPublishedAt, setLoadedPublishedAt] = useState<string | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: GALLERY_FORM_DEFAULTS,
  })

  const photos = watch("photos")
  const coverSrc = watch("coverSrc") ?? ""
  const featured = watch("featured")
  const isPublicVisible = isEditing && isAnnouncementPublished(loadedPublishedAt)

  useEffect(() => {
    if (!editId) return

    let cancelled = false
    ;(async () => {
      try {
        const data = await getGallery(editId)
        if (cancelled) return
        reset(mapGalleryToFormValues(data))
        setLoadedPublishedAt(data.published_at ?? null)
        setLoadedSlug(data.slug)
      } catch {
        if (!cancelled) {
          globalToast.error("Error", "No se pudo cargar la galería.")
          router.push("/Gallery")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [editId, reset, router])

  async function onSubmit(data: GalleryFormValues, action: PublishAction) {
    const scheduledAt = data.publishedAt ? new Date(data.publishedAt) : null
    const hasFutureDate =
      scheduledAt !== null && !Number.isNaN(scheduledAt.getTime()) && scheduledAt > new Date()

    if (action === "schedule") {
      if (!data.publishedAt) {
        setError("publishedAt", { message: "Indica fecha y hora para programar la galería." })
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
      const payload = buildGalleryPayload(data, action)

      if (isEditing && editId) {
        await updateGallery(editId, payload)
        globalToast.success("Galería actualizada", successMessage(action))
      } else {
        await createGallery(payload)
        globalToast.success("Galería guardada", successMessage(action))
      }

      router.push("/Gallery")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado."
      globalToast.error("Error al guardar", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <GalleryFormSkeleton />
  }

  return (
    <div className="space-y-6">
      <GenericHeader
        title={isEditing ? "Editar galería" : "Nueva galería"}
        description={
          isEditing
            ? "Modifica las fotos y los datos del álbum."
            : "Crea un álbum de fotos para el sitio público."
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          {isPublicVisible && loadedSlug ? (
            <Link
              href={`/galeria/${loadedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              Ver público
            </Link>
          ) : null}
          <Button variant="ghost" onClick={() => router.push("/Gallery")}>
            &larr; Volver a la lista
          </Button>
        </div>
      </GenericHeader>

      <div className="rounded-lg border border-border bg-surface-elevated text-foreground shadow-md">
        <form className="divide-y divide-border" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="px-6 py-7 md:px-8">
            <SectionTitle
              title="Datos del álbum"
              description="Título, categoría y descripción que verá la comunidad."
              icon={<IconByName name="fileText" className="h-4.5 w-4.5" />}
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
                name="category"
                control={control}
                render={({ field }) => (
                  <FloatingSelect
                    label="Categoría"
                    helperText="Agrupa el álbum en los filtros de /galeria."
                    error={errors.category?.message}
                    {...field}
                  >
                    {GALLERY_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </FloatingSelect>
                )}
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
                helperText="Solo se usa al programar el álbum."
                error={errors.publishedAt?.message}
                {...register("publishedAt")}
              />
            </div>

            <FloatingInput
              label="Descripción"
              placeholder="Qué se ve en este álbum y en qué contexto ocurrió."
              error={errors.description?.message}
              {...register("description")}
            />

            <div className="mt-2">
              <ToggleChip
                checked={featured}
                onChange={(value) => setValue("featured", value)}
                label="Destacar en el inicio"
              />
            </div>
          </div>

          <Controller
            name="photos"
            control={control}
            render={({ field }) => (
              <PhotosSection
                photos={field.value}
                coverSrc={coverSrc}
                error={errors.photos?.message ?? errors.photos?.root?.message}
                onChange={field.onChange}
                onCoverChange={(src) => setValue("coverSrc", src)}
              />
            )}
          />

          <div className="flex flex-col gap-4 rounded-b-2xl bg-surface-muted px-6 py-5 md:px-8">
            <p className="text-xs text-fg-muted">
              Un álbum necesita al menos una foto con texto alternativo. Usa{" "}
              <strong className="font-medium">Programar</strong> con fecha futura o{" "}
              <strong className="font-medium">Publicar ahora</strong> para hacerlo visible.
            </p>

            <div className="flex w-full flex-wrap items-center justify-end gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push("/Gallery")}
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

      <p className="text-xs text-fg-muted">
        {photos.length} {photos.length === 1 ? "foto cargada" : "fotos cargadas"} en este álbum.
      </p>
    </div>
  )
}

function successMessage(action: PublishAction): string {
  if (action === "draft") return "El borrador se guardó correctamente."
  if (action === "schedule") return "La galería quedó programada."
  return "La galería se publicó correctamente."
}
