import {
  AdmissionsOpenFlow,
  AdmissionsSchoolHero,
  AdmissionsStatusPanel,
  AdmissionsRequirementsSection,
  getAdmissionStatus,
  isAdmissionFormOpen,
} from "@/features/admissions";

export const dynamic = "force-dynamic";

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
