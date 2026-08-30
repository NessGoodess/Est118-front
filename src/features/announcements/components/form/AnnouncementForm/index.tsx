"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api"
import { getAnnouncement, updateAnnouncement } from "@/features/announcements/services/announcements.service"
import {
  announcementSchema,
  ANNOUNCEMENT_FORM_DEFAULTS,
  type AnnouncementFormValues,
} from "@/features/announcements/validations/announcement.schema"
import {
  isAnnouncementPublished,
  type PublishAction,
} from "@/features/announcements/lib/announcement-display"
import { globalToast } from "@/lib/toast"
import AnnouncementFormSkeleton from "@/features/announcements/components/skeletons/AnnouncementFormSkeleton"
import Guide from "./Guide"
import PreviewModal from "./PreviewModal"
import Header from "./Header"
import GeneralSection from "./GeneralSection"
import ContentSection from "./ContentSection"
import MediaSection from "./MediaSection"
import ActionsSection from "./ActionsSection"
import SubmitBar from "./SubmitBar"
import { buildAnnouncementFormData } from "./build-announcement-form-data"
import { mapAnnouncementToFormValues, type AnnouncementResponse } from "./map-announcement-response"

type Props = {
  editId?: string
  duplicateFromId?: string
}

export default function AnnouncementForm({ editId, duplicateFromId }: Props = {}) {
  const router = useRouter()
  const isEditing = Boolean(editId)
  const sourceId = editId ?? duplicateFromId

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(Boolean(sourceId))
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [loadedPublishedAt, setLoadedPublishedAt] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: ANNOUNCEMENT_FORM_DEFAULTS,
  })

  const formValues = watch()
  const mediaType = formValues.mediaType
  const announcementType = formValues.type
  const secondaryButtonEnabled = formValues.secondaryButtonEnabled
  const contentBlocks = formValues.contentBlocks
  const showUrgentAlertLabel = announcementType === "Urgente"
  const isPublicVisible = isEditing && isAnnouncementPublished(loadedPublishedAt)

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview)
      if (videoPreview?.startsWith("blob:")) URL.revokeObjectURL(videoPreview)
    }
  }, [imagePreview, videoPreview])

  useEffect(() => {
    if (!sourceId) return

    async function fetchAnnouncement() {
      try {
        const data = (await getAnnouncement(sourceId as string)) as AnnouncementResponse
        const mapped = mapAnnouncementToFormValues(data)

        if (duplicateFromId && !editId) {
          mapped.title = `Copia de ${mapped.title}`
          mapped.slug = ""
          mapped.publishedAt = ""
        }

        reset(mapped)
        setLoadedPublishedAt(data.published_at ?? null)
        applyLoadedMediaPreview(data, setImagePreview, setVideoPreview)
      } catch {
        globalToast.error("Error", "No se pudo cargar el aviso.")
        router.push("/Announcement")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncement()
  }, [sourceId, duplicateFromId, editId, reset, router])

  function handleMediaTypeChange(value: string) {
    const next = value as AnnouncementFormValues["mediaType"]
    setValue("mediaType", next)
    setValue("mediaFile", null)
    setValue("mediaVideoUrl", "")
    setValue("existingMediaSrc", "")
    setImagePreview(null)
    setVideoPreview(null)

    if (next === "facebook") {
      setValue("mediaAlt", "Publicación de Facebook")
      setValue("mediaYoutubeId", "")
    } else {
      setValue("facebookPostUrl", "")
      if (next !== "youtube") setValue("mediaYoutubeId", "")
    }
  }

  async function onSubmit(data: AnnouncementFormValues, action: PublishAction) {
    const scheduledAt = data.publishedAt ? new Date(data.publishedAt) : null
    const hasFutureDate =
      scheduledAt !== null &&
      !Number.isNaN(scheduledAt.getTime()) &&
      scheduledAt > new Date()

    if (action === "schedule") {
      if (!data.publishedAt) {
        setError("publishedAt", {
          message: "Indica fecha y hora para programar el aviso.",
        })
        return
      }
      if (!hasFutureDate) {
        setError("publishedAt", {
          message: "La fecha de programación debe ser futura.",
        })
        return
      }
    }

    if (action === "publish" && hasFutureDate) {
      setError("publishedAt", {
        message: "Para publicar en esa fecha usa «Programar». «Publicar ahora» ignora este campo.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const fd = buildAnnouncementFormData(data, action)

      if (isEditing && editId) {
        await updateAnnouncement(editId, fd)
        globalToast.success("Aviso actualizado", successMessage(action))
        router.push("/Announcement")
      } else {
        await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        globalToast.success("Aviso guardado", successMessage(action))
        reset(ANNOUNCEMENT_FORM_DEFAULTS)
        setImagePreview(null)
        setVideoPreview(null)
        router.push("/Announcement")
      }
    } catch (err: unknown) {
      const apiError = handleApiError(err)
      globalToast.error("Error al guardar", apiError.message ?? "Ocurrió un error inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function submitWithAction(action: PublishAction) {
    handleSubmit((data) => onSubmit(data, action))()
  }

  function handleCancel() {
    reset(ANNOUNCEMENT_FORM_DEFAULTS)
    setImagePreview(null)
    setVideoPreview(null)
    router.push("/Announcement")
  }

  if (isLoading) {
    return <AnnouncementFormSkeleton />
  }

  return (
    <div className="space-y-6">
      <Header
        isEditing={isEditing}
        editId={editId}
        isPublicVisible={isPublicVisible}
        onPreview={() => setIsPreviewOpen(true)}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg bg-surface-elevated text-foreground shadow-md border border-border">
          <form className="divide-y divide-border" noValidate onSubmit={(e) => e.preventDefault()}>
            <GeneralSection
              register={register}
              control={control}
              errors={errors}
              showUrgentAlertLabel={showUrgentAlertLabel}
            />
            <MediaSection
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              mediaType={mediaType}
              imagePreview={imagePreview}
              videoPreview={videoPreview}
              setImagePreview={setImagePreview}
              setVideoPreview={setVideoPreview}
              onMediaTypeChange={handleMediaTypeChange}
            />
            <ContentSection
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
              contentBlocks={contentBlocks}
              mediaType={mediaType}
            />
            <ActionsSection
              register={register}
              control={control}
              errors={errors}
              secondaryButtonEnabled={secondaryButtonEnabled}
            />
            <SubmitBar
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              onAction={submitWithAction}
            />
          </form>
        </div>
        <div className="lg:sticky lg:top-24">
          <Guide />
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        values={formValues}
        imagePreview={imagePreview}
        videoPreview={videoPreview}
      />
    </div>
  )
}

function successMessage(action: PublishAction): string {
  if (action === "draft") return "El borrador se guardó correctamente."
  if (action === "schedule") return "El aviso quedó programado."
  return "El aviso se publicó correctamente."
}

function applyLoadedMediaPreview(
  data: AnnouncementResponse,
  setImagePreview: (url: string | null) => void,
  setVideoPreview: (url: string | null) => void
) {
  const src = data.media_src?.trim()
  if (!src) return

  if (data.media_type === "image") {
    setImagePreview(src)
    setVideoPreview(null)
    return
  }

  if (data.media_type === "video") {
    setVideoPreview(src)
    setImagePreview(null)
  }
}
