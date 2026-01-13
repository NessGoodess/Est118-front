"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";
import { validateCURP } from "@/lib/utils/curpValidator";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso5Tutor({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const required = formData.apellidoPaternoTutor && formData.apellidoMaternoTutor &&
      formData.nombresTutor && formData.curpTutor && formData.parentesco &&
      formData.telefonoTutor && formData.emailTutor;
    const emailsDiferentes = formData.emailTutor !== formData.emailAspirante;
    const telefonosDiferentes = formData.telefonoTutor !== formData.telefonoAspirante;
    const curpOk = !errors.curpTutor && formData.curpTutor.length === 18;
    setCanContinue(required && emailsDiferentes && telefonosDiferentes && curpOk);
  }, [formData, errors]);

  const handleCURPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
    updateFormData({ curpTutor: value });

    if (value.length === 18) {
      if (!validateCURP(value)) {
        setErrors(prev => ({ ...prev, curpTutor: "CURP inválido" }));
      } else {
        setErrors(prev => ({ ...prev, curpTutor: "" }));
      }
    }
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateFormData({ telefonoTutor: value });

    if (value === formData.telefonoAspirante) {
      setErrors(prev => ({ ...prev, telefonoTutor: "Debe ser diferente al teléfono del aspirante" }));
    } else {
      setErrors(prev => ({ ...prev, telefonoTutor: "" }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({ emailTutor: value });

    if (value === formData.emailAspirante) {
      setErrors(prev => ({ ...prev, emailTutor: "Debe ser diferente al correo del aspirante" }));
    } else {
      setErrors(prev => ({ ...prev, emailTutor: "" }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Datos del Tutor</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido paterno del tutor * <span className="text-xs text-gray-500">(MAYÚSCULAS)</span></label>
          <input
            type="text"
            value={formData.apellidoPaternoTutor}
            onChange={(e) => updateFormData({ apellidoPaternoTutor: e.target.value.toUpperCase() })}
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido materno del tutor * <span className="text-xs text-gray-500">(MAYÚSCULAS)</span></label>
          <input
            type="text"
            value={formData.apellidoMaternoTutor}
            onChange={(e) => updateFormData({ apellidoMaternoTutor: e.target.value.toUpperCase() })}
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre (s) del tutor * <span className="text-xs text-gray-500">(MAYÚSCULAS)</span></label>
          <input
            type="text"
            value={formData.nombresTutor}
            onChange={(e) => updateFormData({ nombresTutor: e.target.value.toUpperCase() })}
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">CURP del tutor * <span className="text-xs text-gray-500">(18 caracteres MAYÚSCULAS)</span></label>
          <input
            type="text"
            value={formData.curpTutor}
            onChange={handleCURPChange}
            maxLength={18}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg uppercase ${errors.curpTutor ? "border-red-500" : formData.curpTutor.length === 18 ? "border-green-500" : "border-gray-300"
              }`}
          />
          {errors.curpTutor && <p className="mt-1 text-sm text-red-600">{errors.curpTutor}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Parentesco del tutor *</label>
          <select
            value={formData.parentesco}
            onChange={(e) => updateFormData({ parentesco: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="">Elige</option>
            <option value="PADRE">Padre</option>
            <option value="MADRE">Madre</option>
            <option value="TUTOR">Tutor</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono de contacto del tutor * <span className="text-xs text-gray-500">(Debe ser diferente del aspirante)</span></label>
          <input
            type="tel"
            value={formData.telefonoTutor}
            onChange={handleTelefonoChange}
            maxLength={10}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg ${errors.telefonoTutor ? "border-red-500" : formData.telefonoTutor.length === 10 ? "border-green-500" : "border-gray-300"
              }`}
          />
          {errors.telefonoTutor && <p className="mt-1 text-sm text-red-600">{errors.telefonoTutor}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico de contacto del tutor * <span className="text-xs text-gray-500">(Debe ser diferente del aspirante)</span></label>
          <input
            type="email"
            value={formData.emailTutor}
            onChange={handleEmailChange}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg ${errors.emailTutor ? "border-red-500" : formData.emailTutor && !errors.emailTutor ? "border-green-500" : "border-gray-300"
              }`}
          />
          {errors.emailTutor && <p className="mt-1 text-sm text-red-600">{errors.emailTutor}</p>}
        </div>
      </div>
      {/* Notas importantes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8 m-6"
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
              Teléfono de contacto del tutor *
              Se utilizará para comunicarle información respecto a su tramite y debe ser diferente del número del aspirante.

            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">•</span>
            <span>Correo electrónico de contacto del tutor *
              Se utilizará para comunicarle información respecto a su tramite y debe ser diferente al correo electrónico del aspirante
            </span>
          </li>

        </ul>
      </motion.div>

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

