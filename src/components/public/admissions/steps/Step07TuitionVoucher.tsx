"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { tuitionVoucherSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputCheckbox } from "@/components/ui/forms";

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
        // Borrar el folio cuando se desactiva el checkbox
        schoolVoucherFolio: hasVoucher ? (formData.tuitionVoucher.schoolVoucherFolio || '') : '',
      },
    });

    // Limpiar errores cuando cambia el checkbox
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

    // Limpiar error del campo cuando el usuario empieza a escribir
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Datos de Vales Escolares</h2>
        <p className="text-gray-600">Información sobre vales escolares del aspirante</p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <InputCheckbox
            label="¿Cuenta con folio de vales escolares? *"
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
              label="Folio correspondiente *"
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
