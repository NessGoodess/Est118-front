"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { guardianInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect } from "@/components/ui/forms";
import Header from "../content/header";
import StepNavigation from "../content/StepNavigation";
import { GUARDIAN_TYPES } from "@/lib/types/select-types";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function GuardianInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData, markStepCompleted } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCURPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
    updateFormData({
      guardianInfo: {
        ...formData.guardianInfo,
        guardianCurp: value,
      },
    });
    if (errors.guardianCurp) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.guardianCurp;
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateFormData({
      guardianInfo: {
        ...formData.guardianInfo,
        guardianPhone: value,
      },
    });
    if (errors.guardianPhone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.guardianPhone;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    // Validar que email y teléfono sean diferentes a los del aspirante
    const guardianData = formData.guardianInfo;
    const applicantData = formData.applicantInfo;

    // Validar con Zod
    const result = guardianInfoSchema.safeParse(guardianData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Validaciones adicionales
    const additionalErrors: Record<string, string> = {};

    if (guardianData.guardianPhone === applicantData.phone) {
      additionalErrors.guardianPhone = "Debe ser diferente al teléfono del aspirante";
    }

    if (guardianData.guardianCurp && guardianData.guardianCurp === applicantData.curp) {
      additionalErrors.guardianCurp = "Debe ser diferente a la CURP del aspirante";
    }

    if (Object.keys(additionalErrors).length > 0) {
      setErrors(additionalErrors);
      return;
    }

    setErrors({});
    markStepCompleted(5);
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <Header title="Datos del Tutor" description="Información del tutor o responsable del aspirante" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Apellido paterno del tutor"
          value={formData.guardianInfo.guardianLastName}
          onChange={(e) => updateFormData({
            guardianInfo: {
              ...formData.guardianInfo,
              guardianLastName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Apellido paterno"
          error={errors.guardianLastName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-1"
        />

        <InputText
          label="Apellido materno del tutor"
          value={formData.guardianInfo.guardianSecondLastName || ''}
          onChange={(e) => updateFormData({
            guardianInfo: {
              ...formData.guardianInfo,
              guardianSecondLastName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Apellido materno"
          error={errors.guardianSecondLastName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-1"
        />

        <InputText
          label="Nombre(s) del tutor"
          value={formData.guardianInfo.guardianFirstName}
          onChange={(e) => updateFormData({
            guardianInfo: {
              ...formData.guardianInfo,
              guardianFirstName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Nombre completo"
          error={errors.guardianFirstName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-2"
        />

        <InputText
          label="CURP del tutor"
          value={formData.guardianInfo.guardianCurp || ''}
          onChange={handleCURPChange}
          placeholder="Ejemplo: GALL991215HOCPRN01"
          maxLength={18}
          error={errors.guardianCurp}
          required
          helperText="18 caracteres alfanuméricos en mayúsculas"
          className="md:col-span-1"
        />

        <InputSelect
          label="Parentesco del tutor"
          value={formData.guardianInfo.guardianRelationship}
          onChange={(e) => updateFormData({
            guardianInfo: {
              ...formData.guardianInfo,
              guardianRelationship: e.target.value,
            },
          })}
          error={errors.guardianRelationship}
          required
          placeholder="Seleccionar parentesco"
          options={GUARDIAN_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
          className="md:col-span-1"
        />

        <InputText
          type="tel"
          label="Teléfono de contacto del tutor"
          value={formData.guardianInfo.guardianPhone}
          onChange={handlePhoneChange}
          placeholder="9511234567"
          maxLength={10}
          error={errors.guardianPhone}
          required
          helperText="Debe ser diferente al teléfono del aspirante (10 dígitos)"
          className="md:col-span-2"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8 mt-6"
      >
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Notas importantes:
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>
              Teléfono de contacto del tutor se utilizará para comunicarle información respecto a su trámite y debe ser diferente del número del aspirante.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>
              La CURP del tutor debe ser diferente a la CURP del aspirante.
            </span>
          </li>
        </ul>
      </motion.div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
