"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { tuitionVoucherSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputCheckbox } from "@/components/ui/forms";
import StepNavigation from "../content/StepNavigation";
import Header from "../content/header";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function TuitionVoucher({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleHasVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasVoucher = e.target.checked;
    updateFormData({
      tuitionVoucher: {
        ...formData.tuitionVoucher,
        hasSchoolVoucher: hasVoucher,
        schoolVoucherFolio: hasVoucher ? (formData.tuitionVoucher.schoolVoucherFolio || '') : '',
      },
    });

    if (errors.hasSchoolVoucher || errors.schoolVoucherFolio) {
      setErrors({});
    }
  };

  const handleFolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      tuitionVoucher: {
        ...formData.tuitionVoucher,
        schoolVoucherFolio: e.target.value,
      },
    });

    if (errors.schoolVoucherFolio) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.schoolVoucherFolio;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    const result = tuitionVoucherSchema.safeParse(formData.tuitionVoucher);
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
      <Header
        title="Datos de Vales Escolares"
        description="Información sobre vales escolares del aspirante"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <InputCheckbox
            label="¿Cuenta con folio de vales escolares?"
            checked={formData.tuitionVoucher.hasSchoolVoucher}
            onChange={handleHasVoucherChange}
            error={errors.hasSchoolVoucher}
            required
          />
        </div>

        {formData.tuitionVoucher.hasSchoolVoucher && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <InputText
              type="text"
              label="Folio correspondiente"
              value={formData.tuitionVoucher.schoolVoucherFolio || ""}
              onChange={handleFolioChange}
              placeholder="Ingrese el folio de vales escolares"
              error={errors.schoolVoucherFolio}
              required
              helperText="Si no lo conoce, consulte en: http://pucsys.oaxaca.gob.mx/consultas"
            />
          </motion.div>
        )}

        {formData.tuitionVoucher.hasSchoolVoucher === false && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              No se requiere folio de vales escolares. Puede continuar con el siguiente paso.
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-8 max-w-2xl mx-auto">
        <p className="text-sm text-blue-900">
          <strong>Importante: </strong>
          Si no lo conoces puedes consultarlo en el siguiente vínculo:{" "}
          <a
            href="http://pucsys.oaxaca.gob.mx/consultas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            http://pucsys.oaxaca.gob.mx/consultas
          </a>
        </p>
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
