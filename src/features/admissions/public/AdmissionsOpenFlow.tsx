"use client";

import { useEffect, useRef, useState } from "react";
import { AdmissionsFormProvider } from "./context/AdmissionsFormContext";
import AdmissionsPreparationSection from "./content/admissions-preparation-section";
import AdmissionsStatusPanel from "./content/admissions-status-panel";
import WizardForm from "./WizardForm";
import { ADMISSIONS_FORM_ID, ADMISSIONS_PREP_ID, scrollToId, } from "./lib/scroll-to-id";
import type { AdmissionStatusResponse } from "../types/admission-cycles";

type Props = {
  admissionStatus: AdmissionStatusResponse;
};

export default function AdmissionsOpenFlow({ admissionStatus }: Props) {
  const [formStarted, setFormStarted] = useState(false);
  const skipScrollOnMount = useRef(true);

  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    scrollToId(formStarted ? ADMISSIONS_FORM_ID : ADMISSIONS_PREP_ID);
  }, [formStarted]);

  return (
    <AdmissionsFormProvider admissionStatus={admissionStatus}>
      {!formStarted ? (
        <>
          <AdmissionsStatusPanel status={admissionStatus} />
          <AdmissionsPreparationSection onStart={() => setFormStarted(true)} />
        </>
      ) : (
        <WizardForm onBackToPreparation={() => setFormStarted(false)} />
      )}
    </AdmissionsFormProvider>
  );
}
