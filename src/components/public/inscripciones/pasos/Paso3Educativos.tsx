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

export default function Paso3Educativos({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const required = formData.escuelaProcedencia && formData.promedio && formData.tieneHermanos;
    const hermanosOk = formData.tieneHermanos === "NO" || (formData.tieneHermanos === "SI" && formData.hermanosInfo);
    setCanContinue(required && hermanosOk);
  }, [formData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Datos Educativos del Aspirante</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la escuela de procedencia *</label>
          <input
            type="text"
            value={formData.escuelaProcedencia}
            onChange={(e) => updateFormData({ escuelaProcedencia: e.target.value.toUpperCase() })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Promedio actual del aspirante *</label>
          <select
            value={formData.promedio}
            onChange={(e) => updateFormData({ promedio: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            {Array.from({ length: 101 }, (_, i) => {
              const value = (i / 10).toFixed(1);
              return <option key={value} value={value}>{value}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">¿El aspirante tiene hermanos estudiando en la escuela? *</label>
          <select
            value={formData.tieneHermanos}
            onChange={(e) => updateFormData({ tieneHermanos: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
        </div>
        {formData.tieneHermanos === "SI" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Indique: nombre completo, grado y grupo</label>
            <textarea
              value={formData.hermanosInfo}
              onChange={(e) => updateFormData({ hermanosInfo: e.target.value.toUpperCase() })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button onClick={prevStep} className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold">← Atrás</button>
        <motion.button
          onClick={nextStep}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          className={`px-8 py-3 rounded-full font-bold text-lg ${
            canContinue ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar →
        </motion.button>
      </div>
    </div>
  );
}

