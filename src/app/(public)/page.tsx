import { Suspense } from "react"
import type { Metadata } from "next"
import HeroWelcome from "@/components/public/hero/HeroWelcomeDefinitive"
import UbicacionSection from "@/components/public/sections/UbicacionSection"
import HomeAnnouncements from "@/features/announcements/public/HomeAnnouncements"
import AnnouncementsSectionSkeleton from "@/features/announcements/public/skeletons/AnnouncementsSectionSkeleton"

export const metadata: Metadata = {
  title: {
    absolute: "EST 118 | Escuela Secundaria Técnica No. 118",
  },
  description:
    "Bienvenido a la Escuela Secundaria Técnica No. 118. Conoce avisos, ubicación e información oficial de nuestra institución.",
}

export default function Home() {
  return (
    <div>
      <HeroWelcome />
      <Suspense fallback={<AnnouncementsSectionSkeleton />}>
        <HomeAnnouncements />
      </Suspense>
      <UbicacionSection />
    </div>
  )
}
