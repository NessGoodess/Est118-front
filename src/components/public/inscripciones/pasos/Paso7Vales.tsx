"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso7Vales({ formData, updateFormData, nextStep, prevStep }: Props) {
  useEffect(() => {
    if (formData.tieneFolioVales === "NO" && !formData.folioVales) {
      updateFormData({ folioVales: "0" });
    }
  }, [formData.tieneFolioVales]);

  const canContinue = formData.tieneFolioVales &&
    (formData.tieneFolioVales === "NO" || (formData.tieneFolioVales === "SI" && formData.folioVales && formData.folioVales !== "0"));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Datos de Vales Escolares</h2>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">¿Cuenta con folio de vales escolares? *</label>
          <select
            value={formData.tieneFolioVales}
            onChange={(e) => {
              updateFormData({ tieneFolioVales: e.target.value });
              if (e.target.value === "NO") {
                updateFormData({ folioVales: "0" });
              } else {
                updateFormData({ folioVales: "" });
              }
            }}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
        </div>

        {formData.tieneFolioVales === "SI" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Folio correspondiente *
              <span className="text-xs text-gray-500 block mt-1 font-normal">
                Si no lo conoce, consulte en: <a href="http://pucsys.oaxaca.gob.mx/consultas" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://pucsys.oaxaca.gob.mx/consultas</a>
              </span>
            </label>
            <input
              type="text"
              value={formData.folioVales}
              onChange={(e) => updateFormData({ folioVales: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </motion.div>
        )}

        {formData.tieneFolioVales === "NO" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Se registrará el folio como "0". Puede consultarlo después en el enlace proporcionado.
            </p>
          </div>
        )}
      </div>

      {/* Aditional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-8">
        <p className="text-sm text-blue-900">
          <strong>Importante: </strong>
          Sino lo conoces puedes consultarlo en el siguiente vinculo:
          <a href="http://pucsys.oaxaca.gob.mx/consultas" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline pl-2">http://pucsys.oaxaca.gob.mx/consultas</a>
        </p>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button onClick={prevStep} className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold">← Atrás</button>
        <motion.button
          onClick={nextStep}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          className={`px-8 py-3 rounded-full font-bold text-lg ${canContinue ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continuar →
        </motion.button>
      </div>
    </div>
  );
}

