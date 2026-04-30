import { z } from "zod"

// ─────────────────────────────────────────────
// Enum literals
// ─────────────────────────────────────────────

export const ANNOUNCEMENT_TYPES = [
  "Informativo",
  "Urgente",
  "Recordatorio",
  "Tarea",
  "General",
] as const

export const CONTENT_TYPES = ["text", "list"] as const
export const MEDIA_TYPES = ["image", "video", "youtube"] as const
export const MEDIA_RATIOS = ["4/3", "3/4", "4/4"] as const

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────

export const announcementSchema = z
  .object({
    // General
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(120, "El título no puede superar 120 caracteres"),
    header: z.string().max(60, "Máximo 60 caracteres").optional().or(z.literal("")),
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

    // Header alert
    headerAlertEnabled: z.boolean(),
    headerAlertLabel: z.string().max(60, "Máximo 60 caracteres").optional().or(z.literal("")),

    // Content
    contentType: z.enum(CONTENT_TYPES),
    contentText: z.string().optional().or(z.literal("")),
    contentItems: z.string().optional().or(z.literal("")),

    // Summary
    summary: z.string().max(300, "El resumen no puede superar 300 caracteres").optional().or(z.literal("")),

    // Buttons
    secondaryButtonEnabled: z.boolean(),
    secondaryButtonLabel: z.string().max(60).optional().or(z.literal("")),
    secondaryButtonHref: z.string().max(255).optional().or(z.literal("")),

    // Media
    mediaType: z.enum(MEDIA_TYPES),
    /** File to upload (image or video) when picked from disk */
    mediaFile: z.instanceof(File).nullable().optional(),
    /** External URL fallback when no file is chosen (video) */
    mediaVideoUrl: z.string().max(512).optional().or(z.literal("")),
    mediaYoutubeId: z.string().max(20).optional().or(z.literal("")),
    mediaAlt: z.string().min(2, "El texto alternativo es requerido").max(120),
    mediaRatio: z.enum(MEDIA_RATIOS),
  })
  .superRefine((data, ctx) => {
    // Content validation
    if (data.contentType === "text" && !data.contentText?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["contentText"],
        message: "El contenido de texto es requerido",
      })
    }
    if (data.contentType === "list" && !data.contentItems?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["contentItems"],
        message: "Escribe al menos un ítem en la lista",
      })
    }

    // Header alert label
    if (data.headerAlertEnabled && !data.headerAlertLabel?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["headerAlertLabel"],
        message: "Escribe el texto del badge de alerta",
      })
    }

    // Secondary button
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

    // Media validation
    if (data.mediaType === "youtube" && !data.mediaYoutubeId?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaYoutubeId"],
        message: "Introduce el ID del video de YouTube",
      })
    }
    if (data.mediaType === "image" && !data.mediaFile) {
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
    if (data.mediaType === "video" && !data.mediaFile && !data.mediaVideoUrl?.trim()) {
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
  header: "",
  slug: "",
  author: "",
  type: "Informativo",
  publishedAt: "",
  important: false,
  headerAlertEnabled: false,
  headerAlertLabel: "",
  contentType: "text",
  contentText: "",
  contentItems: "",
  summary: "",
  secondaryButtonEnabled: false,
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
  mediaType: "image",
  mediaFile: null,
  mediaVideoUrl: "",
  mediaYoutubeId: "",
  mediaAlt: "",
  mediaRatio: "4/3",
}
