"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";
import { validateCURP, extractDataFromCURP } from "@/lib/utils/curpValidator";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso2Aspirante({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [curpError, setCurpError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // Validar si todos los campos requeridos están llenos
    const required = formData.apellidoPaterno && formData.apellidoMaterno && 
                     formData.nombres && formData.curpAspirante && 
                     formData.telefonoAspirante && formData.emailAspirante &&
                     formData.fechaNacimiento && formData.lugarNacimiento && 
                     formData.genero;
    setCanContinue(required && !curpError && !telefonoError);
  }, [formData, curpError, telefonoError]);

  const handleCURPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
    updateFormData({ curpAspirante: value });

    if (value.length === 18) {
      if (validateCURP(value)) {
        setCurpError("");
        const curpData = extractDataFromCURP(value);
        if (curpData) {
          // Autocompletar datos del CURP
          updateFormData({
            fechaNacimiento: curpData.fechaNacimiento,
            age: curpData.age.toString(),
            genero: curpData.genero,
            lugarNacimiento: curpData.lugarNacimiento,
          });
        }
      } else {
        setCurpError("CURP inválido. Verifique que tenga 18 caracteres alfanuméricos.");
      }
    } else if (value.length > 0) {
      setCurpError("La CURP debe tener exactamente 18 caracteres");
    } else {
      setCurpError("");
    }
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateFormData({ telefonoAspirante: value });

    if (value.length === 10) {
      setTelefonoError("");
    } else if (value.length > 0) {
      setTelefonoError("El teléfono debe tener exactamente 10 dígitos");
    } else {
      setTelefonoError("");
    }
  };

  const handleTextChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [name]: e.target.value.toUpperCase() } as Partial<FormData>);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">
          Datos Generales del Aspirante
        </h2>
        <p className="text-gray-600">Información personal del aspirante</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apellido Paterno */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            APELLIDO PATERNO * <span className="text-xs text-gray-500 font-normal">(Solo MAYÚSCULAS)</span>
          </label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleTextChange('apellidoPaterno')}
            placeholder="Ejemplo: GARCÍA"
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Apellido Materno */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            APELLIDO MATERNO * <span className="text-xs text-gray-500 font-normal">(Solo MAYÚSCULAS)</span>
          </label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleTextChange('apellidoMaterno')}
            placeholder="Ejemplo: LÓPEZ"
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Nombres */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            NOMBRES (s) PROPIO (s) SIN APELLIDO (s) * <span className="text-xs text-gray-500 font-normal">(Solo MAYÚSCULAS)</span>
          </label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleTextChange('nombres')}
            placeholder="Ejemplo: JUAN CARLOS"
            pattern="[A-Z\s]+"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* CURP con validación inteligente */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CURP del aspirante * <span className="text-xs text-gray-500 font-normal">(18 caracteres MAYÚSCULAS)</span>
          </label>
          <input
            type="text"
            name="curpAspirante"
            value={formData.curpAspirante}
            onChange={handleCURPChange}
            placeholder="Ejemplo: GALL991215HOCPRN01"
            maxLength={18}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg uppercase ${
              curpError ? "border-red-500" : formData.curpAspirante.length === 18 && !curpError ? "border-green-500" : "border-gray-300"
            }`}
          />
          {curpError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {curpError}
            </p>
          )}
          {formData.curpAspirante.length === 18 && !curpError && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              CURP válido. Datos autocompletados.
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Teléfono de contacto del aspirante * <span className="text-xs text-gray-500 font-normal">(10 dígitos)</span>
          </label>
          <input
            type="tel"
            name="telefonoAspirante"
            value={formData.telefonoAspirante}
            onChange={handleTelefonoChange}
            placeholder="9511234567"
            maxLength={10}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
              telefonoError ? "border-red-500" : formData.telefonoAspirante.length === 10 ? "border-green-500" : "border-gray-300"
            }`}
          />
          {telefonoError && (
            <p className="mt-2 text-sm text-red-600">{telefonoError}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico de contacto del aspirante *
          </label>
          <input
            type="email"
            name="emailAspirante"
            value={formData.emailAspirante}
            onChange={(e) => updateFormData({ emailAspirante: e.target.value.toLowerCase() })}
            placeholder="correo@ejemplo.com"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Fecha de nacimiento (autocompletada) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha de nacimiento *
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={(e) => updateFormData({ fechaNacimiento: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* age (autocompletada, solo lectura) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Edad del aspirante *
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={(e) => updateFormData({age: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-lg"
          >
            <option >Seleccionar</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            </select>
        </div>

        {/* Lugar de nacimiento (autocompletado) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lugar de nacimiento del aspirante *
          </label>
          <select
            name="lugarNacimiento"
            value={formData.lugarNacimiento}
            onChange={(e) => updateFormData({ lugarNacimiento: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            <option value="">Seleccionar</option>
            <option value="OAXACA">Oaxaca</option>
            <option value="OTRO">Otro estado</option>
          </select>
        </div>

        {/* Género (autocompletado) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Género *
          </label>
          <select
            name="genero"
            value={formData.genero}
            onChange={(e) => updateFormData({ genero: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            <option value="">Seleccionar</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          ← Atrás
        </button>
        <motion.button
          onClick={nextStep}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
            canContinue
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

