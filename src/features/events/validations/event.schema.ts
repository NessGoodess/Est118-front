import { z } from "zod"
import { EVENT_TYPES } from "@/features/events/types/event"
import type { AnnouncementContentBlock } from "@/features/announcements/types/announcement"

export const eventSchema = z
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
    type: z.enum(EVENT_TYPES),
    summary: z
      .string()
      .max(300, "El resumen no puede superar 300 caracteres")
      .optional()
      .or(z.literal("")),
    startsAt: z.string().min(1, "Indica cuándo empieza el evento"),
    endsAt: z.string().optional().or(z.literal("")),
    location: z.string().max(160, "Máximo 160 caracteres").optional().or(z.literal("")),
    coverSrc: z.string().optional().or(z.literal("")),
    important: z.boolean(),
    galleryId: z.number().nullable(),
    publishedAt: z.string().optional().or(z.literal("")),
    contentBlocks: z.array(z.custom<AnnouncementContentBlock>()),
  })
  .superRefine((data, ctx) => {
    if (!data.endsAt) return

    const start = new Date(data.startsAt)
    const end = new Date(data.endsAt)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return

    if (end < start) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "La fecha de fin no puede ser anterior al inicio",
      })
    }
  })

export type EventFormValues = z.infer<typeof eventSchema>

export const EVENT_FORM_DEFAULTS: EventFormValues = {
  title: "",
  slug: "",
  type: "Ceremonia",
  summary: "",
  startsAt: "",
  endsAt: "",
  location: "",
  coverSrc: "",
  important: false,
  galleryId: null,
  publishedAt: "",
  contentBlocks: [],
}
