"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Paso0Preparacion from "./pasos/Paso0Preparacion";
import Paso1Correo from "./pasos/Paso1Correo";
import Paso2Aspirante from "./pasos/Paso2Aspirante";
import Paso3Educativos from "./pasos/Paso3Educativos";
import Paso4Domicilio from "./pasos/Paso4Domicilio";
import Paso5Tutor from "./pasos/Paso5Tutor";
import Paso6Taller from "./pasos/Paso6Taller";
import Paso7Vales from "./pasos/Paso7Vales";
import Paso8Documentos from "./pasos/Paso8Documentos";
import Paso9Revision from "./pasos/Paso9Revision";
import Paso10Confirmacion from "./pasos/Paso10Confirmacion";
import UbicacionSection from "../sections/UbicacionSection";
import { FormData } from "@/lib/types/preregistration"
import PreregistrationHeader from "./header";


const TOTAL_STEPS = 10;

export default function WizardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    emailConfirmacion: "",
    emailVerificado: false,
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    curpAspirante: "",
    telefonoAspirante: "",
    emailAspirante: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    age: "",
    genero: "",
    escuelaProcedencia: "",
    promedio: "",
    tieneHermanos: "",
    hermanosInfo: "",
    vialidad: "",
    nombreVialidad: "",
    numeroExterior: "",
    numeroInterior: "",
    asentamiento: "",
    nombreAsentamiento: "",
    municipio: "",
    codigoPostal: "",
    apellidoPaternoTutor: "",
    apellidoMaternoTutor: "",
    nombresTutor: "",
    curpTutor: "",
    parentesco: "",
    telefonoTutor: "",
    emailTutor: "",
    tallerFavorito: "",
    segundaOpcion: "",
    tieneFolioVales: "",
    folioVales: "",
    actaNacimiento: null,
    curpDocumento: null,
    comprobanteDomicilio: null,
    constanciaEstudios: null,
    fotografiaInfantil: null,
    folioPreinscripcion: undefined,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

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
    { number: 0, title: "Preparación", component: Paso0Preparacion },
    { number: 1, title: "Correo", component: Paso1Correo },
    { number: 2, title: "Aspirante", component: Paso2Aspirante },
    { number: 3, title: "Educativos", component: Paso3Educativos },
    { number: 4, title: "Domicilio", component: Paso4Domicilio },
    { number: 5, title: "Tutor", component: Paso5Tutor },
    { number: 6, title: "Taller", component: Paso6Taller },
    { number: 7, title: "Vales", component: Paso7Vales },
    /*{ number: 8, title: "Documentos", component: Paso8Documentos },*/
    { number: 8, title: "Revisión", component: Paso9Revision },
    { number: 9, title: "Confirmación", component: Paso10Confirmacion },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header con logos */}
      <PreregistrationHeader />

      {/* Barra de progreso */}
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

      {/* Indicador de pasos (solo visible en desktop) */}
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

      {/* Contenido del paso actual */}
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
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={currentStep}
            />
          </motion.div>
        </AnimatePresence>
      </section>
      <UbicacionSection />
    </div>

  );
}

