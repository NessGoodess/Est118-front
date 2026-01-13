"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso1Correo({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [emailError, setEmailError] = useState("");
  const [emailConfirmError, setEmailConfirmError] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({ email: value });

    if (value && !validateEmail(value)) {
      setEmailError("Por favor, ingrese un correo electrónico válido");
      setEmailValid(false);
    } else {
      setEmailError("");
      if (value === formData.emailConfirmacion) {
        setEmailValid(true);
      }
    }
  };

  const handleEmailConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    updateFormData({ emailConfirmacion: value });

    if (value && value !== formData.email) {
      setEmailConfirmError("Los correos electrónicos no coinciden");
      setEmailValid(false);
    } else {
      setEmailConfirmError("");
      if (value && validateEmail(value) && value === formData.email) {
        setEmailValid(true);
      }
    }
  };

  const handleContinue = () => {
    if (emailValid && formData.email && formData.emailConfirmacion) {
      updateFormData({ emailVerificado: true });
      nextStep();
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
        {/* Campo de correo principal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            placeholder="ejemplo@correo.com"
            className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
              emailError ? "border-red-500" : formData.email && !emailError ? "border-green-500" : "border-gray-300"
            }`}
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {emailError}
            </p>
          )}
          {formData.email && !emailError && validateEmail(formData.email) && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Correo electrónico válido
            </p>
          )}
        </div>

        {/* Campo de confirmación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar correo electrónico *
          </label>
          <input
            type="email"
            value={formData.emailConfirmacion}
            onChange={handleEmailConfirmChange}
            placeholder="ejemplo@correo.com"
            className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
              emailConfirmError ? "border-red-500" : formData.emailConfirmacion && !emailConfirmError && formData.emailConfirmacion === formData.email ? "border-green-500" : "border-gray-300"
            }`}
          />
          {emailConfirmError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {emailConfirmError}
            </p>
          )}
          {formData.emailConfirmacion && !emailConfirmError && formData.emailConfirmacion === formData.email && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Los correos coinciden
            </p>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Importante:</strong> Asegúrese de tener acceso a este correo, ya que recibirá el folio de preinscripción y las instrucciones para continuar con el proceso.
          </p>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          ← Atrás
        </button>
        <motion.button
          onClick={handleContinue}
          disabled={!emailValid}
          whileHover={emailValid ? { scale: 1.02 } : {}}
          whileTap={emailValid ? { scale: 0.98 } : {}}
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
            emailValid
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar →
        </motion.button>
      </div>
    </div>
  );
}

