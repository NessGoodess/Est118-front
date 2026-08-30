import type { Metadata } from "next"
import {
  BrandPageHero,
  AnnouncementsList,
  getAnnouncementsExtended,
} from "@/features/announcements"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Avisos y noticias",
  description:
    "Consulta los avisos y noticias oficiales de la Escuela. Comunicados, fechas y novedades institucionales.",
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncementsExtended()
  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        title="Avisos y noticias"
        description="Mantente al día con los comunicados oficiales de la institución"
      />
      <AnnouncementsList Announcements={announcements} />
    </div>
  )
}
