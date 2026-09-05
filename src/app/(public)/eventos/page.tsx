import type { Metadata } from "next"
import { BrandPageHero } from "@/features/announcements"
import { EventsList, getPublicEventList } from "@/features/events"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Ceremonias, ferias, torneos y actividades de la Escuela Secundaria Técnica No. 118.",
}

export default async function EventosPage() {
  const events = await getPublicEventList()

  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        title="Próximos eventos"
        description="Participa en nuestras actividades académicas, culturales y deportivas"
      />
      <EventsList events={events} />
    </div>
  )
}
