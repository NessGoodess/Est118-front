"use client";
import { useState } from "react";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { emailSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText } from "@/components/ui/forms/InputText";
import Header from "../content/header";
import { getIcon } from "@/components/ui/icons/public/admission.icons";
import StepNavigation from "../content/StepNavigation";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function EmailVerification({ nextStep, prevStep }: Props) {
  const { formData, updateFormData, markStepCompleted } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({
      email: {
        ...formData.email,
        contactEmail: value,
      },
    });
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
      markStepCompleted(1);
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
    <div className="md:bg-white md:rounded-2xl md:shadow-xl p-6 md:p-12">
      <Header icon={getIcon("email")}
        title="Correo Electrónico"
        description="Por favor, antes de continuar valide que el correo electrónico que ha escrito esté correctamente y que se tenga acceso a él, ya que en él se enviará el folio de preinscripción."
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <InputText
          type="email"
          label="Correo electrónico"
          value={formData.email.contactEmail}
          onChange={handleEmailChange}
          placeholder="ejemplo@correo.com"
          error={errors.contactEmail}
          required
          helperText="Este correo se utilizará para enviarle el folio de preinscripción"
          icon={getIcon("email")}
        />

        <InputText
          type="email"
          label="Confirmar correo electrónico"
          value={formData.email.contactEmailConfirmation}
          onChange={handleEmailConfirmChange}
          placeholder="ejemplo@correo.com"
          error={errors.contactEmailConfirmation}
          required
          helperText="Debe coincidir con el correo electrónico anterior"
          icon={getIcon("check")}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Importante:</strong> Asegúrese de tener acceso a este correo, ya que recibirá el folio de preinscripción y las instrucciones para continuar con el proceso.
          </p>
        </div>
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
