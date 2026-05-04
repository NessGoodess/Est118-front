import { notFound } from "next/navigation"
import { getAnnouncementExtendedByIdOrSlug } from "@/lib/data/announcementsExtended"
import AnnouncementDetailContent from "./DetailContent"

export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params
  const Announcement = await getAnnouncementExtendedByIdOrSlug(id)
  if (!Announcement) notFound()

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(circle_at_70%_20%,rgba(232,64,64,0.07)_0%,transparent_50%),
                       radial-gradient(circle_at_20%_80%,rgba(26,86,219,0.06)_0%,transparent_45%)]"
      />
      <section className="relative px-[clamp(20px,6vw,80px)] pt-[clamp(24px,5vw,48px)] pb-6">
        <div className="relative mx-auto max-w-4xl">
          
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.07em] text-blue-600">
            {Announcement.header}
          </p>
          <h1 className="mt-1 font-[Syne,sans-serif] text-[clamp(26px,3.5vw,42px)] font-extrabold leading-tight tracking-tight text-[#0d1117]">
            {Announcement.title}
          </h1>
          <span className="mt-3 block h-[3px] w-12 rounded-full bg-red-500" />
        </div>
      </section>
      <AnnouncementDetailContent Announcement={Announcement} />
    </div>
  )
}
