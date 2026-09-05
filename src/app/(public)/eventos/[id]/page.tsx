import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BrandPageHero } from "@/features/announcements"
import { EventDetail, getPublicEventByIdOrSlug } from "@/features/events"
import { getSiteUrl } from "@/lib/site"

export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const event = await getPublicEventByIdOrSlug(id)
  if (!event) {
    return { title: "Evento no encontrado" }
  }

  const description =
    event.summary || `${event.type} · ${event.dateLabel} en la Escuela Secundaria Técnica 118.`
  const url = `${getSiteUrl()}/eventos/${event.slug || event.id}`
  const image = event.cover ?? `${getSiteUrl()}/background4.png`

  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: event.title,
      description,
      siteName: "EST 118",
      locale: "es_MX",
      images: [{ url: image, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [image],
    },
  }
}

export default async function EventoPage({ params }: PageProps) {
  const { id } = await params
  const event = await getPublicEventByIdOrSlug(id)
  if (!event) notFound()

  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        size="md"
        eyebrow="Evento"
        title={event.title}
        meta={
          <div className="flex flex-col gap-3">
            <span className="w-fit rounded-full border border-public-glass-border bg-public-glass px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase text-public-on-media">
              {event.type}
            </span>
            <p className="flex flex-wrap items-center gap-1.5 font-sans text-sm text-public-on-media-muted">
              <span>{event.dateLabel}</span>
              {event.timeLabel ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{event.timeLabel}</span>
                </>
              ) : null}
            </p>
          </div>
        }
      />
      <EventDetail event={event} />
    </div>
  )
}
