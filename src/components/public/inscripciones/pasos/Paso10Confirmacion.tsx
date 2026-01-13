"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";
import Link from "next/link";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso10Confirmacion({ formData }: Props) {
  const folio = formData.folioPreinscripcion || `2025-118-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  useEffect(() => {
    // Aquí se enviaría el correo con el folio
    // Por ahora solo simulamos
    console.log("Enviando correo a:", formData.email, "con folio:", folio);
  }, [folio, formData.email]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Icono de éxito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
        >
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-merriweather">
          ¡Preinscripción Registrada!
        </h2>

        {/* Folio destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border-2 border-blue-600 rounded-xl p-6 mb-6 max-w-md mx-auto"
        >
          <p className="text-sm text-gray-600 mb-2">Folio de Preinscripción</p>
          <p className="text-3xl font-bold text-blue-600 font-mono">{folio}</p>
        </motion.div>

        {/* Información importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6 text-left max-w-2xl mx-auto"
        >
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Próximos Pasos:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Se ha enviado un correo electrónico a <strong>{formData.email}</strong> con su folio de preinscripción y las instrucciones completas.</li>
            <li>Asista al área de <strong>Contraloría</strong> en las instalaciones de la escuela con el folio impreso o en su dispositivo móvil.</li>
            <li><strong>Horario de atención:</strong> 7:15 a 9:30 y de 10:00 a 13:30 horas, de lunes a viernes.</li>
            <li>Presente el folio y cubra la cuota de preinscripción para completar el proceso.</li>
          </ol>
        </motion.div>

        {/* Información de contacto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Información de Contacto</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Dirección:</strong> Río Tehuantepec 300, Fraccionamiento los Ríos, Oaxaca de Juárez, 68020</p>
            <p><strong>Teléfono:</strong> 951 513 4204</p>
            <p><strong>Correo:</strong> est188@est118.edu.mx</p>
            <p className="mt-3">
              <strong>Facebook oficial:</strong>{" "}
              <a href="https://www.facebook.com/EscSecTecnica118" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                EscSecTecnica118
              </a>
            </p>
          </div>
        </motion.div>

        {/* Nota de privacidad */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-500 max-w-2xl mx-auto mb-6"
        >
          La información proporcionada es protegida por la Ley Federal de Transparencia y Acceso a la Información Pública Gubernamental, y solamente será utilizada para los fines requeridos por la institución.
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-semibold transition-all"
          >
            📄 Imprimir Folio
          </motion.button>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all"
            >
              Volver al Inicio
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      
    </div>
  );
}

