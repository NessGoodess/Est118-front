import type { Metadata } from "next";
import CalendarSection from "@/components/public/sections/CalendarSection";

export const metadata: Metadata = {
  title: "Calendario Escolar",
  description:
    "Fechas importantes, vacaciones, exámenes y eventos del ciclo escolar de la Escuela Secundaria Técnica No. 118.",
};

export default function CalendarPage() {
  return <CalendarSection />;
}
