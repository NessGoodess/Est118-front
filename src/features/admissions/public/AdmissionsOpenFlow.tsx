"use client";

import { useState } from "react";
import { AdmissionsFormProvider } from "./context/AdmissionsFormContext";
import AdmissionsPreparationSection from "./content/admissions-preparation-section";
import WizardForm from "./WizardForm";
import type { AdmissionStatusResponse } from "../types/admission-cycles";

type Props = {
  admissionStatus: AdmissionStatusResponse;
};

export default function AdmissionsOpenFlow({ admissionStatus }: Props) {
  const [formStarted, setFormStarted] = useState(false);

  const startForm = () => {
    setFormStarted(true);
    window.requestAnimationFrame(() => {
      document
        .getElementById("admissions-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <AdmissionsFormProvider admissionStatus={admissionStatus}>
      {!formStarted ? (
        <>
        <AdmissionsPreparationSection onStart={startForm} />
        </>
      ) : (
        <WizardForm
          nested
          admissionStatus={admissionStatus}
          onBackToPreparation={() => {
            setFormStarted(false);
            window.requestAnimationFrame(() => {
              document
                .getElementById("admissions-prep")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          }}
        />
      )}
    </AdmissionsFormProvider>
  );
}
