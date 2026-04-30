import { getAnnouncementsExtended } from "@/lib/data/announcementsExtended"
import AnnouncementsList from "./AnnouncementsList"
import SectionHeader from "@/components/public/sections/SectionHeader"

export const revalidate = 60

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncementsExtended()
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(circle_at_70%_20%,rgba(232,64,64,0.07)_0%,transparent_50%),
                       radial-gradient(circle_at_20%_80%,rgba(26,86,219,0.06)_0%,transparent_45%)]"
      />
      <SectionHeader 
        text="Avisos"
        title="Comunicados y noticias importantes"
        description="Mantente al día con los avisos oficiales de la institución."
      />
      <AnnouncementsList Announcements={announcements} />
    </div>
  )
}
