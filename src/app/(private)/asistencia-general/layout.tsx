import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asistencia General - Escuela Secundaria Técnica No. 118",
  description: "Sistema de asistencia general para estudiantes de la Escuela Secundaria Técnica No. 118",
  keywords: ["asistencia", "estudiantes", "escuela", "técnica", "118"],
};

export default function AsistenciaGeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
