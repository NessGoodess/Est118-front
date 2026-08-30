import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  AnnouncementDetailContent,
  AnnouncementDetailHero,
  getAnnouncementExtendedByIdOrSlug,
  getAnnouncementPublicUrl,
} from "@/features/announcements"
import { getSiteUrl } from "@/lib/site"

export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

function absoluteMediaUrl(src: string | undefined): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//i.test(src)) return src
  const base = getSiteUrl()
  return `${base}${src.startsWith("/") ? src : `/${src}`}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const announcement = await getAnnouncementExtendedByIdOrSlug(id)
  if (!announcement) {
    return { title: "Aviso no encontrado" }
  }

  const url = getAnnouncementPublicUrl(announcement.slug || announcement.id)
  const description =
    announcement.resumen ||
    (announcement.content?.type === "text"
      ? (announcement.content.text ?? announcement.title).slice(0, 160)
      : announcement.title)
  const image =
    absoluteMediaUrl(announcement.media?.src) ||
    `${getSiteUrl()}/background4.png`

  return {
    title: announcement.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: announcement.title,
      description,
      siteName: "EST 118",
      locale: "es_MX",
      images: [{ url: image, alt: announcement.media?.alt || announcement.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: announcement.title,
      description,
      images: [image],
    },
  }
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params
  const announcement = await getAnnouncementExtendedByIdOrSlug(id)
  if (!announcement) notFound()

  return (
    <div className="min-h-screen bg-surface-app">
      <AnnouncementDetailHero announcement={announcement} />
      <AnnouncementDetailContent Announcement={announcement} />
    </div>
  )
}
