import type { Metadata } from "next";
import {
  AdmissionsOpenFlow,
  AdmissionsSchoolHero,
  AdmissionsStatusPanel,
  AdmissionsRequirementsSection,
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
      <AdmissionsStatusPanel status={status} showActiveBanner={formOpen} />
      {formOpen ? (
        <AdmissionsOpenFlow admissionStatus={status} />
      ) : (
        <AdmissionsRequirementsSection
          subtitle="Reúna estos documentos con anticipación. El formulario en línea solo captura datos; la validación física se realiza en la escuela."
        />
      )}
    </>
  );
}
