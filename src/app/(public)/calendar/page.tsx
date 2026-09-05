import type { Metadata } from "next";
import { BrandPageHero } from "@/features/announcements";
import { getCalendarEvents } from "@/features/events";
import CalendarSection from "@/components/public/sections/CalendarSection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Calendario Escolar",
  description:
    "Fechas importantes, vacaciones, exámenes y eventos del ciclo escolar de la Escuela Secundaria Técnica No. 118.",
};

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="min-h-screen bg-surface-app">
      <BrandPageHero
        title="Calendario Escolar"
        description="Fechas importantes, vacaciones, exámenes y eventos del ciclo escolar"
      />
      <CalendarSection events={events} />
    </div>
  );
}
