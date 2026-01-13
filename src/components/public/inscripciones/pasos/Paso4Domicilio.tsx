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

export default function Paso4Domicilio({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const required = formData.vialidad && formData.nombreVialidad && formData.numeroExterior &&
                     formData.asentamiento && formData.nombreAsentamiento && formData.municipio &&
                     formData.codigoPostal && formData.codigoPostal.length === 5;
    setCanContinue(!!required);
  }, [formData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Datos del Domicilio Actual del Aspirante</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vialidad *</label>
          <select
            value={formData.vialidad}
            onChange={(e) => updateFormData({ vialidad: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="CALLE">Calle</option>
            <option value="AVENIDA">Avenida</option>
            <option value="BOULEVARD">Boulevard</option>
            <option value="PRIVADA">Privada</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la vialidad *</label>
          <input
            type="text"
            value={formData.nombreVialidad}
            onChange={(e) => updateFormData({ nombreVialidad: e.target.value.toUpperCase() })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Número exterior *</label>
          <input
            type="text"
            value={formData.numeroExterior}
            onChange={(e) => updateFormData({ numeroExterior: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Número interior</label>
          <input
            type="text"
            value={formData.numeroInterior}
            onChange={(e) => updateFormData({ numeroInterior: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Asentamiento *</label>
          <select
            value={formData.asentamiento}
            onChange={(e) => updateFormData({ asentamiento: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="COLONIA">Colonia</option>
            <option value="FRACCIONAMIENTO">Fraccionamiento</option>
            <option value="UNIDAD">Unidad</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del asentamiento *</label>
          <input
            type="text"
            value={formData.nombreAsentamiento}
            onChange={(e) => updateFormData({ nombreAsentamiento: e.target.value.toUpperCase() })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del municipio *</label>
          <select
            value={formData.municipio}
            onChange={(e) => updateFormData({ municipio: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="OAXACA DE JUAREZ">Oaxaca de Juárez</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Código postal * 
            <a href="https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/Descarga.aspx" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1 text-xs">Consultar</a>
          </label>
          <input
            type="text"
            value={formData.codigoPostal}
            onChange={(e) => updateFormData({ codigoPostal: e.target.value.replace(/\D/g, '').slice(0, 5) })}
            maxLength={5}
            pattern="[0-9]{5}"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
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

