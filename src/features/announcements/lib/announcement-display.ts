import type {
  AnnouncementContentBlock,
  AnnouncementExtended,
} from "@/features/announcements/types/announcement"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"

export type PublishAction = "draft" | "publish" | "schedule"

const HEADER_BY_TYPE: Record<AnnouncementFormValues["type"], string> = {
  Informativo: "Informativo",
  Urgente: "Aviso urgente",
  Recordatorio: "Recordatorio",
  Tarea: "Tarea",
  General: "Comunicado",
  Noticia: "Noticia",
}

export function headerFromType(type: AnnouncementFormValues["type"]): string {
  return HEADER_BY_TYPE[type] ?? type
}

export function shouldShowAlertBadge(type: AnnouncementFormValues["type"]): boolean {
  return type === "Urgente"
}

export function alertLabelFromForm(
  type: AnnouncementFormValues["type"],
  customLabel?: string
): string {
  if (type !== "Urgente") return ""
  return customLabel?.trim() || "Aviso urgente"
}

/** First paragraph block text, trimmed for auto-summary. */
export function summaryFromBlocks(blocks: AnnouncementContentBlock[] | undefined, max = 300): string {
  const paragraph = blocks?.find((b) => b.type === "paragraph" && b.text.trim())
  if (!paragraph || paragraph.type !== "paragraph") return ""
  const text = paragraph.text.trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
}

export function isAnnouncementPublished(
  publishedAt: string | null | undefined,
  now = new Date()
): boolean {
  if (!publishedAt) return false
  const date = new Date(publishedAt)
  return !Number.isNaN(date.getTime()) && date <= now
}

export function isAnnouncementScheduled(
  publishedAt: string | null | undefined,
  now = new Date()
): boolean {
  if (!publishedAt) return false
  const date = new Date(publishedAt)
  return !Number.isNaN(date.getTime()) && date > now
}

export function announcementStatusLabel(
  publishedAt: string | null | undefined
): "Borrador" | "Programado" | "Publicado" {
  if (!publishedAt) return "Borrador"
  if (isAnnouncementScheduled(publishedAt)) return "Programado"
  return "Publicado"
}

export function cardDisplayText(
  item: Pick<AnnouncementExtended, "resumen" | "title" | "media">
): string {
  const text = item.resumen?.trim() || ""
  if (!text) return ""
  // Auto-filled from title when media is Facebook — don't repeat under the headline.
  if (item.media?.type === "facebook" && text === item.title?.trim()) {
    return ""
  }
  return text
}

export function splitLayoutOrder(position: "left" | "right" = "right") {
  const mediaFirst = position === "left"
  return {
    text: mediaFirst ? "order-2" : "order-1",
    media: mediaFirst ? "order-1" : "order-2",
  }
}
