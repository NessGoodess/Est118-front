"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmailVerification from "./steps/Step01EmailVerification";
import ApplicantInfo from "./steps/Step02ApplicantInfo";
import AcademicInfo from "./steps/Step03AcademicInfo";
import AddressInfo from "./steps/Step04AddressInfo";
import GuardianInfo from "./steps/Step05GuardianInfo";
import WorkshopSelection from "./steps/Step06WorkshopSelection";
import TuitionVoucher from "./steps/Step07TuitionVoucher";
import Review from "./steps/Step09Review";
import Confirmation from "./steps/Step10Confirmation";
import UbicacionSection from "@/components/public/sections/UbicacionSection";
import { useAdmissionsForm } from "./context/AdmissionsFormContext";
import { ADMISSIONS_FORM_ID, scrollToId } from "./lib/scroll-to-id";

const FORM_MAX = "max-w-5xl";

const FORM_STEPS = [
  { number: 1, title: "Correo", component: EmailVerification },
  { number: 2, title: "Aspirante", component: ApplicantInfo },
  { number: 3, title: "Educativos", component: AcademicInfo },
  { number: 4, title: "Domicilio", component: AddressInfo },
  { number: 5, title: "Tutor", component: GuardianInfo },
  { number: 6, title: "Taller", component: WorkshopSelection },
  { number: 7, title: "Vales", component: TuitionVoucher },
  { number: 8, title: "Revisión", component: Review },
  { number: 9, title: "Confirmación", component: Confirmation },
] as const;

const LAST_INPUT_STEP = 8;

type Props = {
  onBackToPreparation?: () => void;
};

/** Requiere `AdmissionsFormProvider` en un ancestro (OpenFlow). */
export default function WizardForm({ onBackToPreparation }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const skipScrollOnMount = useRef(true);
  const { completeSteps } = useAdmissionsForm();
  const current = FORM_STEPS[stepIndex];
  const CurrentStepComponent = current.component;
  const isConfirmation = current.number === 9;
  const showProgress = current.number <= LAST_INPUT_STEP;

  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    scrollToId(ADMISSIONS_FORM_ID);
  }, [stepIndex]);

  const nextStep = () => {
    if (stepIndex < FORM_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (stepIndex === 0) {
      onBackToPreparation?.();
      return;
    }
    setStepIndex((prev) => prev - 1);
  };

  const goToStepNumber = (stepNumber: number) => {
    const nextIndex = FORM_STEPS.findIndex((step) => step.number === stepNumber);
    if (nextIndex >= 0) {
      setStepIndex(nextIndex);
    }
  };

  return (
    <section
      id={ADMISSIONS_FORM_ID}
      className="min-h-screen scroll-mt-28 bg-surface-app"
    >
      {showProgress && (
        <div className="bg-primary py-3 text-primary-foreground">
          <div className={`${FORM_MAX} mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Paso {current.number} de {LAST_INPUT_STEP}
              </span>
              <span className="text-sm font-medium">
                {Math.round((current.number / LAST_INPUT_STEP) * 100)}% completado
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-primary-hover">
              <motion.div
                className="h-2 rounded-full bg-accent-gold"
                initial={{ width: 0 }}
                animate={{
                  width: `${(current.number / LAST_INPUT_STEP) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {showProgress && (
        <div className="hidden border-b border-border bg-surface-muted lg:block">
          <div className={`${FORM_MAX} mx-auto px-4 py-4 sm:px-6 lg:px-8`}>
            <div className="flex items-center justify-between">
              {FORM_STEPS.filter((step) => step.number <= LAST_INPUT_STEP).map(
                (step, index, list) => {
                  const isCompleted = completeSteps.includes(step.number);
                  const isCurrent = step.number === current.number;

                  return (
                    <div key={step.number} className="flex flex-1 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (isCompleted || step.number < current.number) {
                            goToStepNumber(step.number);
                          }
                        }}
                        disabled={!isCompleted && step.number > current.number}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                          isCurrent
                            ? "bg-primary font-semibold text-primary-foreground"
                            : isCompleted
                              ? "bg-success/10 text-success hover:bg-success/15"
                              : "bg-surface-muted text-fg-muted"
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isCurrent
                              ? "bg-surface-elevated text-primary"
                              : isCompleted
                                ? "bg-success text-success-foreground"
                                : "bg-surface-muted text-fg-muted"
                          }`}
                        >
                          {isCompleted ? "✓" : step.number}
                        </div>
                        <span className="hidden text-xs xl:inline">{step.title}</span>
                      </button>
                      {index < list.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 ${
                            step.number < current.number
                              ? "bg-success"
                              : "bg-surface-muted"
                          }`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      <article className={`${FORM_MAX} mx-auto px-4 py-8 sm:px-6 md:py-10 lg:px-8`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={current.number}
            />
          </motion.div>
        </AnimatePresence>
      </article>
      {isConfirmation && <UbicacionSection />}
    </section>
  );
}
