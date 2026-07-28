"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { workshopSelectSchema } from "@/lib/validations/admissions/admissions.schema";
import StepNavigation from "../content/StepNavigation";
import Header from "../content/header";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

const talleres = [
  {
    id: "Confección del vestido e industria Textil",
    nombre: "Confección del vestido e industria Textil",
    descripcion: "Aprende técnicas de costura, diseño y confección de prendas de vestir",
    icono: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg>,
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "Máquinas, herramientas y sistemas de control",
    nombre: "Máquinas, herramientas y sistemas de control",
    descripcion: "Desarrollo de habilidades técnicas en maquinaria y sistemas automatizados",
    icono: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog-icon lucide-cog"><path d="M11 10.27 7 3.34" /><path d="m11 13.73-4 6.93" /><path d="M12 22v-2" /><path d="M12 2v2" /><path d="M14 12h8" /><path d="m17 20.66-1-1.73" /><path d="m17 3.34-1 1.73" /><path d="M2 12h2" /><path d="m20.66 17-1.73-1" /><path d="m20.66 7-1.73 1" /><path d="m3.34 17 1.73-1" /><path d="m3.34 7 1.73 1" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="8" /></svg>,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "Diseño Industrial",
    nombre: "Diseño Industrial",
    descripcion: "Creatividad y diseño de productos con enfoque industrial y funcional",
    icono: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-factory-icon lucide-factory"><path d="M12 16h.01" /><path d="M16 16h.01" /><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" /><path d="M8 16h.01" /></svg>,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "Informática",
    nombre: "Informática",
    descripcion: "Programación, sistemas y tecnología de la información",
    icono: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu-icon lucide-cpu"><path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" /><path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" /><path d="M20 12h2" /><path d="M20 17h2" /><path d="M20 7h2" /><path d="M7 20v2" /><path d="M7 2v2" /><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="8" y="8" width="8" height="8" rx="1" /></svg>,
    color: "from-green-500 to-emerald-600"
  },
];

export default function WorkshopSelection({ nextStep, prevStep }: Props) {
  const { formData, updateFormData, markStepCompleted } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTallerSelect = (tallerId: string, tipo: 'favorito' | 'segunda') => {
    if (tipo === 'favorito') {
      updateFormData({
        workshopSelect: {
          ...formData.workshopSelect,
          workshopFirstChoice: tallerId,
          workshopSecondChoice: formData.workshopSelect.workshopSecondChoice === tallerId ? '' : formData.workshopSelect.workshopSecondChoice,
        },
      });
    } else {
      if (tallerId !== formData.workshopSelect.workshopFirstChoice) {
        updateFormData({
          workshopSelect: {
            ...formData.workshopSelect,
            workshopSecondChoice: tallerId,
          },
        });
      }
    }

    if (errors.workshopFirstChoice || errors.workshopSecondChoice) {
      setErrors({});
    }
  };

  const handleContinue = () => {
    const result = workshopSelectSchema.safeParse(formData.workshopSelect);
    if (result.success) {
      setErrors({});
      markStepCompleted(6);
      nextStep();
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
    }
  };

  const tallerFavorito = formData.workshopSelect.workshopFirstChoice;
  const segundaOpcion = formData.workshopSelect.workshopSecondChoice;

  return (
    <div className="md:bg-surface-elevated md:rounded-2xl md:shadow-xl p-6 md:p-12">
      <Header
        title="Selección de Tecnología"
        description="De las opciones de taller, marca tu opción favorita, enseguida, selecciona una segunda opción, que te será asignada en caso de no haber cupo en la primera."
      />

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Taller Favorito
          {errors.workshopFirstChoice && (
            <span className="text-red-600 text-sm ml-2">{errors.workshopFirstChoice}</span>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talleres.map((taller) => (
            <motion.button
              key={taller.id}
              type="button"
              onClick={() => handleTallerSelect(taller.id, 'favorito')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${tallerFavorito === taller.id
                ? "border-primary bg-primary-soft shadow-lg"
                : errors.workshopFirstChoice
                  ? "border-red-300 bg-red-50"
                  : "border-border bg-surface-elevated hover:border-border"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${tallerFavorito === taller.id ? 'scale-110' : ''} transition-transform`}>
                  {taller.icono}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">{taller.nombre}</h4>
                  <p className="text-sm text-fg-muted">{taller.descripcion}</p>
                </div>
                {tallerFavorito === taller.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {tallerFavorito && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Segunda Opción
            {errors.workshopSecondChoice && (
              <span className="text-red-600 text-sm ml-2">{errors.workshopSecondChoice}</span>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {talleres.filter(t => t.id !== tallerFavorito).map((taller) => (
              <motion.button
                key={taller.id}
                type="button"
                onClick={() => handleTallerSelect(taller.id, 'segunda')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${segundaOpcion === taller.id
                  ? "border-green-600 bg-green-50 shadow-lg"
                  : errors.workshopSecondChoice
                    ? "border-red-300 bg-red-50"
                    : "border-border bg-surface-elevated hover:border-border"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${segundaOpcion === taller.id ? 'scale-110' : ''} transition-transform`}>
                    {taller.icono}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{taller.nombre}</h4>
                    <p className="text-sm text-fg-muted">{taller.descripcion}</p>
                  </div>
                  {segundaOpcion === taller.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
