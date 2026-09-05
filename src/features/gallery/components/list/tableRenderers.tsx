import { formatShortWithTime } from "@/lib/utils/dateFormatter"
import { announcementStatusLabel } from "@/features/announcements/lib/announcement-display"
import type { GalleryRawItem } from "@/features/gallery/types/gallery"

export const galleryTableRenderers = {
  title: (value: unknown) => (
    <span className="line-clamp-2 max-w-sm whitespace-wrap">{value as string}</span>
  ),

  "category-badge": (value: unknown) => (
    <span className="inline-flex items-center rounded-full border border-border bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
      {value as string}
    </span>
  ),

  "photos-count": (value: unknown) => (
    <span className="font-mono text-sm text-foreground">{(value as number) ?? 0}</span>
  ),

  "featured-badge": (value: unknown) => {
    if (!value) return null
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent">
        Destacada
      </span>
    )
  },

  "publish-status": (_value: unknown, row?: GalleryRawItem) => {
    const status = announcementStatusLabel(row?.published_at)
    const colors: Record<string, string> = {
      Borrador: "bg-surface-muted text-fg-muted border-border",
      Programado: "bg-warning/10 text-warning-foreground border-warning/30",
      Publicado: "bg-success/10 text-success border-success/30",
    }
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
      >
        {status}
      </span>
    )
  },

  datetime: (value: unknown) => {
    if (!value) return <span className="text-sm text-fg-muted">-</span>
    return (
      <span className="cursor-help text-sm" title={new Date(value as string).toLocaleString()}>
        {formatShortWithTime(new Date(value as string))}
      </span>
    )
  },
}
