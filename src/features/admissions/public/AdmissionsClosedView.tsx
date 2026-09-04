import AdmissionsStatusPanel from "./content/admissions-status-panel";
import AdmissionsRequirementsSection from "./content/admissions-requirements-section";
import type { AdmissionStatusResponse } from "../types/admission-cycles";

type Props = {
  status: AdmissionStatusResponse;
};

/** Vista cuando el ciclo no acepta preinscripciones en línea. */
export default function AdmissionsClosedView({ status }: Props) {
  return (
    <>
      <AdmissionsStatusPanel status={status} />
      <AdmissionsRequirementsSection
        subtitle="Reúna estos documentos con anticipación. El formulario en línea solo captura datos; la validación física se realiza en la escuela."
      />
    </>
  );
}
