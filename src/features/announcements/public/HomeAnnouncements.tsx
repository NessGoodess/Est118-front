import { getHomeAnnouncements } from "@/features/announcements/lib/announcements-data"
import AnnouncementsSection from "@/features/announcements/public/AnnouncementsSection"

/** Server slice for home — enables Suspense + skeleton around the fetch. */
export default async function HomeAnnouncements() {
  const announcements = await getHomeAnnouncements(5)
  return <AnnouncementsSection Announcements={announcements} />
}
