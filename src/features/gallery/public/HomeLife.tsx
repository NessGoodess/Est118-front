import { getFeaturedGalleryAlbums } from "@/features/gallery/lib/galleries-data"
import { getPublicEventList } from "@/features/events/lib/events-data"
import { isEventPast } from "@/features/events/lib/event-display"
import HomeLifeSection from "./HomeLifeSection"

/** Server slice for home — featured album + upcoming events. */
export default async function HomeLife() {
  const [albums, events] = await Promise.all([
    getFeaturedGalleryAlbums(1),
    getPublicEventList({ upcoming: true, limit: 3 }),
  ])

  const upcoming = events.filter((event) => !isEventPast(event)).slice(0, 3)

  return <HomeLifeSection albums={albums} upcoming={upcoming} />
}
