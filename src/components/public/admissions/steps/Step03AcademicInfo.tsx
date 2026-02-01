"use client";
import { useState } from "react";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { academicInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect, InputCheckbox, InputTextarea } from "@/components/ui/forms";
import Header from "../content/header";
import StepNavigation from "../content/StepNavigation";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function AcademicInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData, markStepCompleted } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({
      academicInfo: {
        ...formData.academicInfo,
        currentAverage: e.target.value,
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
      markStepCompleted(3);
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

  const averageOptions = [
    { value: "0", label: 'Seleccionar promedio' },
    ...Array.from({ length: 41 }, (_, i) => {
      const value = (6 + i * 0.1).toFixed(1);
      return { value, label: value };
    })
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <Header title="Datos Educativos del Aspirante" description="Información académica del aspirante" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Nombre de la escuela de procedencia"
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
          label="Promedio actual del aspirante"
          value={formData.academicInfo.currentAverage.toString()}
          onChange={handleAverageChange}
          error={errors.currentAverage}
          required
          placeholder="Seleccionar promedio"
          options={averageOptions.map(o => ({ ...o, value: o.value.toString() }))}
          className="md:col-span-1"
        />

        <div className="md:col-span-1">
          <InputCheckbox
            label="¿El aspirante tiene hermanos estudiando en la escuela?"
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
              label="Indique: nombre completo, grado y grupo"
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

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
