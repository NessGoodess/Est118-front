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

const talleres = [
  {
    id: "CONFECCION_VESTIDO",
    nombre: "Confección del vestido e industria Textil",
    descripcion: "Aprende técnicas de costura, diseño y confección de prendas de vestir",
    icono: "🧵",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "MAQUINAS_HERRAMIENTAS",
    nombre: "Máquinas, herramientas y sistemas de control",
    descripcion: "Desarrollo de habilidades técnicas en maquinaria y sistemas automatizados",
    icono: "⚙️",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "DISEÑO_INDUSTRIAL",
    nombre: "Diseño Industrial",
    descripcion: "Creatividad y diseño de productos con enfoque industrial y funcional",
    icono: "🎨",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "INFORMATICA",
    nombre: "Informática",
    descripcion: "Programación, sistemas y tecnología de la información",
    icono: "💻",
    color: "from-green-500 to-emerald-600"
  },
];

export default function Paso6Taller({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [tallerFavorito, setTallerFavorito] = useState(formData.tallerFavorito);
  const [segundaOpcion, setSegundaOpcion] = useState(formData.segundaOpcion);

  const handleTallerSelect = (tallerId: string, tipo: 'favorito' | 'segunda') => {
    if (tipo === 'favorito') {
      setTallerFavorito(tallerId);
      updateFormData({ tallerFavorito: tallerId });
      // Si el favorito es igual a la segunda opción, limpiar segunda opción
      if (segundaOpcion === tallerId) {
        setSegundaOpcion("");
        updateFormData({ segundaOpcion: "" });
      }
    } else {
      if (tallerId !== tallerFavorito) {
        setSegundaOpcion(tallerId);
        updateFormData({ segundaOpcion: tallerId });
      }
    }
  };

  const canContinue = tallerFavorito && segundaOpcion && tallerFavorito !== segundaOpcion;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">
          Selección de Tecnología
        </h2>
        <p className="text-gray-600 mb-4">
          De las opciones de taller, marca tu opción favorita, enseguida, selecciona una segunda opción, que te será asignada en caso de no haber cupo en la primera.
        </p>
      </motion.div>

      {/* Taller Favorito */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Taller Favorito *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talleres.map((taller) => (
            <motion.button
              key={taller.id}
              type="button"
              onClick={() => handleTallerSelect(taller.id, 'favorito')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                tallerFavorito === taller.id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${tallerFavorito === taller.id ? 'scale-110' : ''} transition-transform`}>
                  {taller.icono}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{taller.nombre}</h4>
                  <p className="text-sm text-gray-600">{taller.descripcion}</p>
                </div>
                {tallerFavorito === taller.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Segunda Opción */}
      {tallerFavorito && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Segunda Opción *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {talleres.filter(t => t.id !== tallerFavorito).map((taller) => (
              <motion.button
                key={taller.id}
                type="button"
                onClick={() => handleTallerSelect(taller.id, 'segunda')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  segundaOpcion === taller.id
                    ? "border-green-600 bg-green-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${segundaOpcion === taller.id ? 'scale-110' : ''} transition-transform`}>
                    {taller.icono}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{taller.nombre}</h4>
                    <p className="text-sm text-gray-600">{taller.descripcion}</p>
                  </div>
                  {segundaOpcion === taller.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

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

