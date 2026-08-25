"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { workshopSelectSchema } from "../../validations/admissions.schema";
import StepNavigation from "../content/StepNavigation";
import Header from "../content/header";
import IconByName from "@/components/ui/icons/IconByName";

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
    icono: <IconByName name="palette" className="h-10 w-10" />,
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "Máquinas, herramientas y sistemas de control",
    nombre: "Máquinas, herramientas y sistemas de control",
    descripcion: "Desarrollo de habilidades técnicas en maquinaria y sistemas automatizados",
    icono: <IconByName name="cog" className="h-10 w-10" />,
    color: "from-brand-500 to-accent"
  },
  {
    id: "Diseño Industrial",
    nombre: "Diseño Industrial",
    descripcion: "Creatividad y diseño de productos con enfoque industrial y funcional",
    icono: <IconByName name="factory" className="h-10 w-10" />,
    color: "from-brand-500 to-brand-700"
  },
  {
    id: "Informática",
    nombre: "Informática",
    descripcion: "Programación, sistemas y tecnología de la información",
    icono: <IconByName name="cpu" className="h-10 w-10" />,
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
            <span className="text-danger text-sm ml-2">{errors.workshopFirstChoice}</span>
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
                  ? "border-danger/40 bg-danger/10"
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
                      <IconByName name="check" className="w-4 h-4 text-white" />
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
              <span className="text-danger text-sm ml-2">{errors.workshopSecondChoice}</span>
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
                  ? "border-success bg-success/10 shadow-lg"
                  : errors.workshopSecondChoice
                    ? "border-danger/40 bg-danger/10"
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
                        <IconByName name="check" className="w-4 h-4 text-white" />
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
