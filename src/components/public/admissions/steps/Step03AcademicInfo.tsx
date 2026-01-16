"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { academicInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect, InputCheckbox, InputTextarea } from "@/components/ui/forms";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function AcademicInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({
      academicInfo: {
        ...formData.academicInfo,
        currentAverage: value,
      },
    });
    if (errors.currentAverage) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.currentAverage;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    const result = academicInfoSchema.safeParse(formData.academicInfo);
    if (result.success) {
      setErrors({});
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

  const averageOptions = Array.from({ length: 101 }, (_, i) => {
    const value = (i / 10).toFixed(1);
    return { value, label: value };
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">
          Datos Educativos del Aspirante
        </h2>
        <p className="text-gray-600">Información académica del aspirante</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Nombre de la escuela de procedencia *"
          value={formData.academicInfo.previousSchool}
          onChange={(e) => updateFormData({
            academicInfo: {
              ...formData.academicInfo,
              previousSchool: e.target.value.toUpperCase(),
            },
          })}
          placeholder="Nombre completo de la escuela"
          error={errors.previousSchool}
          required
          className="md:col-span-2"
        />

        <InputSelect
          label="Promedio actual del aspirante *"
          value={formData.academicInfo.currentAverage.toString()}
          onChange={handleAverageChange}
          error={errors.currentAverage}
          required
          placeholder="Seleccionar promedio"
          options={averageOptions}
          className="md:col-span-1"
        />

        <div className="md:col-span-1">
          <InputCheckbox
            label="¿El aspirante tiene hermanos estudiando en la escuela? *"
            checked={formData.academicInfo.hasSiblings}
            onChange={(e) => updateFormData({
              academicInfo: {
                ...formData.academicInfo,
                hasSiblings: e.target.checked,
                siblingsDetails: e.target.checked ? formData.academicInfo.siblingsDetails : '',
              },
            })}
            error={errors.hasSiblings}
            required
          />
        </div>

        {formData.academicInfo.hasSiblings && (
          <div className="md:col-span-2">
            <InputTextarea
              label="Indique: nombre completo, grado y grupo *"
              value={formData.academicInfo.siblingsDetails || ''}
              onChange={(e) => updateFormData({
                academicInfo: {
                  ...formData.academicInfo,
                  siblingsDetails: e.target.value.toUpperCase(),
                },
              })}
              rows={3}
              error={errors.siblingsDetails}
              required
              helperText="Proporcione los detalles de los hermanos"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          ← Atrás
        </button>
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-full font-bold text-lg transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
        >
          Continuar →
        </motion.button>
      </div>
    </div>
  );
}
