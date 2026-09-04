import type { Metadata } from "next";
import {
  AdmissionsOpenFlow,
  AdmissionsClosedView,
  AdmissionsSchoolHero,
  getAdmissionStatus,
  isAdmissionFormOpen,
} from "@/features/admissions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preinscripciones",
  description:
    "Preinscripción en linea. Consulta requisitos, fechas y el estado del proceso de admisión.",
};

export default async function InscripcionesPage() {
  const status = await getAdmissionStatus();
  const formOpen = isAdmissionFormOpen(status);

  return (
    <>
      <AdmissionsSchoolHero status={status} />
      {formOpen ? (
        <AdmissionsOpenFlow admissionStatus={status} />
      ) : (
        <AdmissionsClosedView status={status} />
      )}
    </>
  );
}
