"use client"

import type {
  AnnouncementCardData,
  AnnouncementContentBlock,
  AnnouncementExtended,
} from "@/features/announcements/types/announcement"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"
import {
  alertLabelFromForm,
  headerFromType,
  shouldShowAlertBadge,
  splitLayoutOrder,
} from "@/features/announcements/lib/announcement-display"
import { IconByName } from "@/components/ui/icons"
import FacebookMediaPlaceholder from "@/features/announcements/shared/FacebookMediaPlaceholder"

interface AnnouncementLivePreviewProps {
  values: AnnouncementFormValues
  imagePreview: string | null
  videoPreview: string | null
}

function mediaSrcFromForm(
  values: AnnouncementFormValues,
  imagePreview: string | null,
  videoPreview: string | null
): string | undefined {
  if (values.mediaType === "image") {
    return imagePreview || values.existingMediaSrc || undefined
  }
  if (values.mediaType === "video") {
    return videoPreview || values.mediaVideoUrl || values.existingMediaSrc || undefined
  }
  return undefined
}

export function formValuesToPreviewCard(
  values: AnnouncementFormValues,
  imagePreview: string | null,
  videoPreview: string | null
): AnnouncementCardData {
  const alertEnabled = shouldShowAlertBadge(values.type)

  return {
    id: "preview",
    slug: values.slug || "vista-previa",
    headerAlert: alertEnabled
      ? {
          enabled: true,
          label: alertLabelFromForm(values.type, values.headerAlertLabel),
        }
      : undefined,
    header: headerFromType(values.type),
    title: values.title?.trim() || "Título del aviso",
    content: {
      type: "text",
      text: values.summary?.trim() || "Escribe un resumen para las tarjetas…",
    },
    resumen: values.summary?.trim() || undefined,
    secondaryButton: {
      enabled: values.secondaryButtonEnabled,
      label: values.secondaryButtonLabel?.trim() || "Acción",
      href: values.secondaryButtonHref?.trim() || "#",
    },
    media: {
      type: values.mediaType,
      src: mediaSrcFromForm(values, imagePreview, videoPreview),
      youtubeId:
        values.mediaType === "youtube"
          ? values.mediaYoutubeId?.trim() || undefined
          : undefined,
      facebookPostUrl:
        values.mediaType === "facebook"
          ? values.facebookPostUrl?.trim() || undefined
          : undefined,
      alt:
        values.mediaType === "facebook"
          ? values.mediaAlt?.trim() || "Publicación de Facebook"
          : values.mediaAlt?.trim() || "Vista previa",
      ratio: values.mediaRatio || "4/3",
      position: values.mediaPosition || "right",
    },
    type: values.type,
    importante: values.important,
    autor: values.author?.trim() || undefined,
  }
}

export function formValuesToPreviewExtended(
  values: AnnouncementFormValues,
  imagePreview: string | null,
  videoPreview: string | null
): AnnouncementExtended {
  const card = formValuesToPreviewCard(values, imagePreview, videoPreview)
  return {
    ...card,
    contentBlocks: values.contentBlocks ?? [],
    facebookPostUrl:
      values.mediaType === "facebook"
        ? values.facebookPostUrl?.trim() || null
        : null,
  }
}

/** Body of the public preview (home card + detail layout). */
export default function AnnouncementLivePreview({
  values,
  imagePreview,
  videoPreview,
}: AnnouncementLivePreviewProps) {
  const card = formValuesToPreviewCard(values, imagePreview, videoPreview)
  const detail = formValuesToPreviewExtended(values, imagePreview, videoPreview)
  const blocks = detail.contentBlocks ?? []

  return (
    <div className="space-y-8 text-foreground">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Tarjeta en home / listado</h3>
        <p className="text-xs text-fg-muted">
          Vista aproximada del aviso destacado y las tarjetas del listado.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-surface-app p-4 md:p-6">
          <PreviewCard data={card} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Página de detalle</h3>
        <p className="text-xs text-fg-muted">
          Hero del aviso más el contenido extendido que verán al abrir el enlace.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-surface-app p-4 md:p-6">
          <DetailPreview data={detail} />
        </div>
      </section>

      {blocks.length === 0 ? (
        <p className="text-xs text-fg-muted">
          Sin bloques extendidos: el detalle mostrará solo el resumen en el hero.
        </p>
      ) : null}
    </div>
  )
}

function PreviewCard({ data }: { data: AnnouncementCardData }) {
  const ratio =
    data.media.ratio === "3/4"
      ? "aspect-[3/4]"
      : data.media.ratio === "4/4"
        ? "aspect-square"
        : "aspect-[4/3]"
  const layout = splitLayoutOrder(data.media.position ?? "right")

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
      <div className={layout.text}>
        {data.headerAlert?.enabled ? (
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-danger">
            {data.headerAlert.label}
          </p>
        ) : null}

        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
          {data.header}
        </p>
        <h3 className="mt-1 font-merriweather text-xl font-extrabold leading-snug text-foreground md:text-2xl">
          {data.title}
        </h3>

        {data.resumen ? (
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{data.resumen}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Leer más
            <IconByName name="arrowRight" className="h-3.5 w-3.5" />
          </span>
          {data.secondaryButton?.enabled ? (
            <span className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">
              {data.secondaryButton.label}
            </span>
          ) : null}
        </div>

        {(data.type || data.importante || data.autor) && (
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-fg-muted">
            {data.type ? (
              <span className="rounded-full border border-border px-2 py-0.5">{data.type}</span>
            ) : null}
            {data.importante ? (
              <span className="rounded-full border border-danger/30 bg-danger/10 px-2 py-0.5 text-danger">
                Importante
              </span>
            ) : null}
            {data.autor ? <span className="px-1">{data.autor}</span> : null}
          </div>
        )}
      </div>

      <div className={layout.media}>
        <PreviewMedia data={data} ratioClass={ratio} />
      </div>
    </div>
  )
}

function DetailPreview({ data }: { data: AnnouncementExtended }) {
  const ratio =
    data.media.ratio === "3/4"
      ? "aspect-[3/4]"
      : data.media.ratio === "4/4"
        ? "aspect-square"
        : "aspect-[4/3]"
  const hasMedia =
    data.media.type === "facebook" ||
    (data.media.type === "youtube" && data.media.youtubeId) ||
    Boolean(data.media.src)

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-brand-900 via-brand-700 to-brand-900 px-4 py-5 text-white md:px-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
          {data.header}
        </p>
        <h3 className="font-merriweather text-lg font-bold leading-snug md:text-xl">{data.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.type ? (
            <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase">
              {data.type}
            </span>
          ) : null}
          {data.importante ? (
            <span className="rounded-full border border-danger/40 bg-danger/20 px-2 py-0.5 text-[10px] font-semibold uppercase">
              Importante
            </span>
          ) : null}
        </div>
        {data.autor ? <p className="mt-2 text-xs text-white/75">{data.autor}</p> : null}
      </div>

      {hasMedia ? (
        <div className="rounded-2xl border border-foreground/6 bg-surface-elevated/80 p-4 md:p-5">
          <PreviewMedia data={data} ratioClass={ratio} />
          {data.secondaryButton?.enabled ? (
            <span className="mt-4 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">
              {data.secondaryButton.label}
            </span>
          ) : null}
        </div>
      ) : null}

      {data.resumen || data.contentBlocks.length > 0 ? (
        <div className="mx-auto max-w-3xl space-y-5">
          {data.resumen ? (
            <p className="border-l-4 border-primary/40 pl-4 text-sm font-medium leading-relaxed text-foreground">
              {data.resumen}
            </p>
          ) : null}
          {data.contentBlocks.length > 0
            ? data.contentBlocks.map((block, i) => (
                <PreviewContentBlock key={i} block={block} />
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}

function PreviewContentBlock({ block }: { block: AnnouncementContentBlock }) {
  if (block.type === "paragraph") {
    if (!block.text.trim()) return null
    return (
      <p className="text-sm leading-relaxed text-fg-muted">{block.text}</p>
    )
  }

  if (block.type === "list") {
    const items = block.items.map((i) => i.trim()).filter(Boolean)
    if (!items.length) return null
    return (
      <ul className="space-y-2 text-sm text-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <IconByName name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === "image" && block.src.trim()) {
    return (
      <figure className="overflow-hidden rounded-xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary URLs in admin preview */}
        <img src={block.src} alt={block.alt || ""} className="w-full object-cover" />
        {block.caption ? (
          <figcaption className="px-3 py-2 text-center text-xs text-fg-muted">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  if (block.type === "video" && block.src.trim()) {
    return (
      <figure className="overflow-hidden rounded-xl border border-border">
        <video src={block.src} controls className="w-full" />
        {block.caption ? (
          <figcaption className="px-3 py-2 text-center text-xs text-fg-muted">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  if (block.type === "youtube" && block.youtubeId.trim()) {
    return (
      <figure className="overflow-hidden rounded-xl border border-border">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            title="YouTube"
            src={`https://www.youtube.com/embed/${block.youtubeId}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {block.caption ? (
          <figcaption className="px-3 py-2 text-center text-xs text-fg-muted">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return null
}

function PreviewMedia({
  data,
  ratioClass,
}: {
  data: AnnouncementCardData
  ratioClass: string
}) {
  const { media } = data

  if (media.type === "facebook") {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl ${ratioClass}`}>
        <FacebookMediaPlaceholder className="absolute inset-0" />
        {media.facebookPostUrl ? (
          <p className="absolute bottom-2 left-2 right-2 truncate rounded bg-black/60 px-2 py-1 text-[10px] text-white">
            {media.facebookPostUrl}
          </p>
        ) : null}
      </div>
    )
  }

  if (media.type === "youtube" && media.youtubeId) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl bg-black ${ratioClass}`}>
        <iframe
          title={media.alt}
          src={`https://www.youtube.com/embed/${media.youtubeId}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (media.type === "video" && media.src) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl bg-black ${ratioClass}`}>
        <video src={media.src} className="absolute inset-0 h-full w-full object-cover" muted controls />
      </div>
    )
  }

  if (media.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- blob: and arbitrary API URLs in admin preview
      <img
        src={media.src}
        alt={media.alt}
        className={`w-full rounded-2xl object-cover ${ratioClass}`}
      />
    )
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-2xl bg-surface-muted text-fg-muted ${ratioClass}`}
    >
      <IconByName name="image" className="h-10 w-10 opacity-50" />
    </div>
  )
}
