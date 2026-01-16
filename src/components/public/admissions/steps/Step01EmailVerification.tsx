"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { emailSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText } from "@/components/ui/forms/InputText";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function EmailVerification({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({
      email: {
        ...formData.email,
        contactEmail: value,
      },
    });
    // Limpiar error al cambiar
    if (errors.contactEmail) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contactEmail;
        return newErrors;
      });
    }
  };

  const handleEmailConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({
      email: {
        ...formData.email,
        contactEmailConfirmation: value,
      },
    });
    // Limpiar error al cambiar
    if (errors.contactEmailConfirmation) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contactEmailConfirmation;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    const result = emailSchema.safeParse(formData.email);
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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-merriweather">
          Correo Electrónico *
        </h2>
        <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
          Por favor, antes de continuar valide que el correo electrónico que ha escrito esté correctamente y que se tenga acceso a él, ya que en él se enviará el folio de preinscripción.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <InputText
          type="email"
          label="Correo electrónico *"
          value={formData.email.contactEmail}
          onChange={handleEmailChange}
          placeholder="ejemplo@correo.com"
          error={errors.contactEmail}
          required
          helperText="Este correo se utilizará para enviarle el folio de preinscripción"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <InputText
          type="email"
          label="Confirmar correo electrónico *"
          value={formData.email.contactEmailConfirmation}
          onChange={handleEmailConfirmChange}
          placeholder="ejemplo@correo.com"
          error={errors.contactEmailConfirmation}
          required
          helperText="Debe coincidir con el correo electrónico anterior"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Importante:</strong> Asegúrese de tener acceso a este correo, ya que recibirá el folio de preinscripción y las instrucciones para continuar con el proceso.
          </p>
        </div>
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
