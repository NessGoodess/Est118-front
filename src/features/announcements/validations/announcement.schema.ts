import { z } from "zod"
import { isFacebookPostUrl } from "@/features/announcements/lib/facebook-sdk"

// ─────────────────────────────────────────────
// Enum literals
// ─────────────────────────────────────────────

export const ANNOUNCEMENT_TYPES = [
  "Informativo",
  "Urgente",
  "Recordatorio",
  "Tarea",
  "General",
  "Noticia",
] as const

export const MEDIA_TYPES = ["image", "video", "youtube", "facebook"] as const
export const MEDIA_RATIOS = ["4/3", "3/4", "4/4"] as const
export const MEDIA_POSITIONS = ["left", "right"] as const

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string() }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("image"),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    src: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("youtube"),
    youtubeId: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("gallery"),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    ),
    layout: z.enum(["carousel", "grid"]),
    title: z.string().optional(),
    caption: z.string().optional(),
    albumHref: z.string().optional(),
  }),
  z.object({
    type: z.literal("gallery_ref"),
    galleryId: z.number(),
    layout: z.enum(["carousel", "grid"]),
    title: z.string().optional(),
  }),
])

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────

export const announcementSchema = z
  .object({
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(120, "El título no puede superar 120 caracteres"),
    slug: z
      .string()
      .regex(/^[a-z0-9-]*$/, "Solo letras minúsculas, números y guiones")
      .max(80, "Máximo 80 caracteres")
      .optional()
      .or(z.literal("")),
    author: z.string().max(80, "Máximo 80 caracteres").optional().or(z.literal("")),
    type: z.enum(ANNOUNCEMENT_TYPES),
    publishedAt: z.string().optional().or(z.literal("")),
    important: z.boolean(),

    headerAlertLabel: z.string().max(60, "Máximo 60 caracteres").optional().or(z.literal("")),

    contentBlocks: z.array(contentBlockSchema),

    summary: z.string().max(300, "El resumen no puede superar 300 caracteres").optional().or(z.literal("")),

    facebookPostUrl: z
      .string()
      .max(1024, "Máximo 1024 caracteres")
      .optional()
      .or(z.literal("")),

    secondaryButtonEnabled: z.boolean(),
    secondaryButtonLabel: z.string().max(60).optional().or(z.literal("")),
    secondaryButtonHref: z.string().max(255).optional().or(z.literal("")),

    mediaType: z.enum(MEDIA_TYPES),
    mediaFile: z.instanceof(File).nullable().optional(),
    existingMediaSrc: z.string().optional().or(z.literal("")),
    mediaVideoUrl: z.string().max(512).optional().or(z.literal("")),
    mediaYoutubeId: z.string().max(20).optional().or(z.literal("")),
    mediaAlt: z.string().max(120).optional().or(z.literal("")),
    mediaRatio: z.enum(MEDIA_RATIOS),
    mediaPosition: z.enum(MEDIA_POSITIONS),
  })
  .superRefine((data, ctx) => {
    const isFacebook = data.mediaType === "facebook"
    const fbUrl = data.facebookPostUrl?.trim()

    if (isFacebook) {
      if (!fbUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["facebookPostUrl"],
          message: "Pega la URL del post público de Facebook",
        })
      } else if (!isFacebookPostUrl(fbUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["facebookPostUrl"],
          message: "Pega la URL de un post público de Facebook",
        })
      }
    } else if (fbUrl && !isFacebookPostUrl(fbUrl)) {
      ctx.addIssue({
        code: "custom",
        path: ["facebookPostUrl"],
        message: "Pega la URL de un post público de Facebook",
      })
    }

    if (data.type === "Urgente" && !data.headerAlertLabel?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["headerAlertLabel"],
        message: "Escribe el texto del badge de alerta para avisos urgentes",
      })
    }

    if (data.secondaryButtonEnabled) {
      if (!data.secondaryButtonLabel?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["secondaryButtonLabel"],
          message: "El texto del botón secundario es requerido",
        })
      }
      if (!data.secondaryButtonHref?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["secondaryButtonHref"],
          message: "La URL del botón secundario es requerida",
        })
      }
    }

    if (isFacebook) {
      return
    }

    if (!data.summary?.trim() || data.summary.trim().length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["summary"],
        message: "El resumen debe tener al menos 10 caracteres",
      })
    }

    if (!data.mediaAlt?.trim() || data.mediaAlt.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaAlt"],
        message: "El texto alternativo es requerido",
      })
    }

    if (data.mediaType === "youtube" && !data.mediaYoutubeId?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaYoutubeId"],
        message: "Introduce el ID del video de YouTube",
      })
    }
    if (
      data.mediaType === "image" &&
      !data.mediaFile &&
      !data.existingMediaSrc?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaFile"],
        message: "Selecciona una imagen para subir",
      })
    } else if (data.mediaType === "image" && data.mediaFile) {
      if (data.mediaFile.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: "custom",
          path: ["mediaFile"],
          message: "El archivo excede el tamaño máximo permitido de 5 MB",
        })
      }
    }
    if (
      data.mediaType === "video" &&
      !data.mediaFile &&
      !data.mediaVideoUrl?.trim() &&
      !data.existingMediaSrc?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaFile"],
        message: "Sube un video o introduce una URL",
      })
    } else if (data.mediaType === "video" && data.mediaFile) {
      if (data.mediaFile.size > 50 * 1024 * 1024) {
        ctx.addIssue({
          code: "custom",
          path: ["mediaFile"],
          message: "El archivo excede el tamaño máximo permitido de 50 MB",
        })
      }
    }
  })

export type AnnouncementFormValues = z.infer<typeof announcementSchema>

export const ANNOUNCEMENT_FORM_DEFAULTS: AnnouncementFormValues = {
  title: "",
  slug: "",
  author: "",
  type: "Informativo",
  publishedAt: "",
  important: false,
  headerAlertLabel: "Aviso urgente",
  contentBlocks: [],
  summary: "",
  facebookPostUrl: "",
  secondaryButtonEnabled: false,
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
  mediaType: "image",
  mediaFile: null,
  existingMediaSrc: "",
  mediaVideoUrl: "",
  mediaYoutubeId: "",
  mediaAlt: "",
  mediaRatio: "4/3",
  mediaPosition: "right",
}
