import type { AppIconName } from "@/components/ui/icons"
import type { PublicEvent } from "@/features/events/types/event"

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const

/** Icon shown next to each event type in cards and the calendar. */
export const EVENT_TYPE_ICON: Record<string, AppIconName> = {
  Ceremonia: "star",
  Feria: "palette",
  Torneo: "ticket",
  Examen: "fileText",
  Cultural: "palette",
  Deportivo: "ticket",
  Académico: "graduationCap",
  Junta: "users",
  Entrega: "upload",
  Suspensión: "alert",
  Vacaciones: "calendar",
}

export function eventTypeIcon(type: string): AppIconName {
  return EVENT_TYPE_ICON[type] ?? "calendarTime"
}

/** Short day/month badge used on cards ("12" / "SEP"). */
export function eventDateBadge(event: PublicEvent): { day: string; month: string } {
  const date = new Date(event.startsAt)
  if (Number.isNaN(date.getTime())) return { day: "--", month: "" }
  return {
    day: String(date.getDate()),
    month: MONTHS[date.getMonth()].slice(0, 3).toUpperCase(),
  }
}

/** "12 – 16 de septiembre" when the event spans several days. */
export function eventRangeLabel(event: PublicEvent): string | null {
  if (!event.endsAt) return null

  const start = new Date(event.startsAt)
  const end = new Date(event.endsAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  if (start.toDateString() === end.toDateString()) return null

  const month = MONTHS[start.getMonth()].toLowerCase()
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} de ${month}`
  }

  return `${start.getDate()} de ${month} – ${end.getDate()} de ${MONTHS[
    end.getMonth()
  ].toLowerCase()}`
}

export function isEventPast(event: PublicEvent, now = new Date()): boolean {
  const reference = new Date(event.endsAt ?? event.startsAt)
  return !Number.isNaN(reference.getTime()) && reference < now
}
