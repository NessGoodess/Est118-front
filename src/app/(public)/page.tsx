import { Suspense } from "react"
import type { Metadata } from "next"
import HeroWelcome from "@/components/public/hero/HeroWelcome"
import UbicacionSection from "@/components/public/sections/UbicacionSection"
import HomeAnnouncements from "@/features/announcements/public/HomeAnnouncements"
import AnnouncementsSectionSkeleton from "@/features/announcements/public/skeletons/AnnouncementsSectionSkeleton"
import { HomeLife, HomeLifeSkeleton } from "@/features/gallery"
import { IdentityBannerCarousel, WorkshopsSection } from "@/features/school"

export const metadata: Metadata = {
  title: {
    absolute: "EST 118 | Escuela Secundaria Técnica No. 118",
  },
  description:
    "Escuela Secundaria Técnica No. 118 de Oaxaca. Talleres de informática, diseño industrial, confección y máquinas; avisos y vida escolar.",
}

export default function Home() {
  return (
    <div>
      <HeroWelcome />
      <IdentityBannerCarousel />
      <Suspense fallback={<AnnouncementsSectionSkeleton />}>
        <HomeAnnouncements />
      </Suspense>
      <WorkshopsSection />
      <Suspense fallback={<HomeLifeSkeleton />}>
        <HomeLife />
      </Suspense>
      <UbicacionSection />
    </div>
  )
}
