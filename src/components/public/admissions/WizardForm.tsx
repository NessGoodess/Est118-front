"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Preparation from "./steps/Step00Preparation";
import EmailVerification from "./steps/Step01EmailVerification";
import ApplicantInfo from "./steps/Step02ApplicantInfo";
import AcademicInfo from "./steps/Step03AcademicInfo";
import AddressInfo from "./steps/Step04AddressInfo";
import GuardianInfo from "./steps/Step05GuardianInfo";
import WorkshopSelection from "./steps/Step06WorkshopSelection";
import TuitionVoucher from "./steps/Step07TuitionVoucher";
import Review from "./steps/Step09Review";
import Confirmation from "./steps/Step10Confirmation";
import UbicacionSection from "../sections/UbicacionSection";
import HeaderMain from "./content/headerMain";
import { AdmissionsFormProvider } from "./context/AdmissionsFormContext";

const TOTAL_STEPS = 10;

function WizardFormContent() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { number: 0, title: "Preparación", component: Preparation },
    { number: 1, title: "Correo", component: EmailVerification },
    { number: 2, title: "Aspirante", component: ApplicantInfo },
    { number: 3, title: "Educativos", component: AcademicInfo },
    { number: 4, title: "Domicilio", component: AddressInfo },
    { number: 5, title: "Tutor", component: GuardianInfo },
    { number: 6, title: "Taller", component: WorkshopSelection },
    { number: 7, title: "Vales", component: TuitionVoucher },
    { number: 8, title: "Revisión", component: Review },
    { number: 9, title: "Confirmación", component: Confirmation },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:bg-hsla(30, 3%, 12%, 1.00)">
      <HeaderMain />
      {currentStep > 0 && currentStep < 9 && (
        <div className="bg-blue-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Paso {currentStep} de {TOTAL_STEPS - 2}
              </span>
              <span className="text-sm font-medium">
                {Math.round((currentStep / (TOTAL_STEPS - 2)) * 100)}% completado
              </span>
            </div>
            <div className="w-full bg-blue-700 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (TOTAL_STEPS - 2)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep > 0 && currentStep < 9 && (
        <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.slice(1, 9).map((step, index) => {
                const stepNumber = step.number;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                  <div key={stepNumber} className="flex items-center flex-1">
                    <button
                      onClick={() => goToStep(stepNumber)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isCurrent
                        ? "bg-blue-600 text-white font-semibold"
                        : isCompleted
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent
                        ? "bg-white text-blue-600"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                        }`}>
                        {isCompleted ? "✓" : stepNumber}
                      </div>
                      <span className="text-xs hidden xl:inline">{step.title}</span>
                    </button>
                    {index < steps.slice(1, 9).length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${stepNumber < currentStep ? "bg-green-600" : "bg-gray-300"
                        }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={currentStep}
            />
          </motion.div>
        </AnimatePresence>
      </section>
      {currentStep === 9 && (
        <UbicacionSection />
      )}
    </div>
  );
}

export default function WizardForm() {
  return (
    <AdmissionsFormProvider>
      <WizardFormContent />
    </AdmissionsFormProvider>
  );
}

