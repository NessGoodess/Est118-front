"use client";
import { motion } from "framer-motion";
import { AdmissionsIcons } from "@/components/ui/icons/public/admission.icons";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

const documentos = [
  {
    icon: (<AdmissionsIcons.document className="md:w-8 md:h-8" />),
    name: "Acta de nacimiento del aspirante",
    type: "",
    require: true
  },
  {
    icon: (<AdmissionsIcons.nationalId className="md:w-8 md:h-8" />),
    name: "CURP del aspirante",
    type: "",
    require: true
  },
  {
    icon: (<AdmissionsIcons.location className="md:w-8 md:h-8" />),
    name: "Comprobante de domicilio del aspirante",
    type: "no mayor a 3 meses",
    require: true
  },
  {
    icon: (<AdmissionsIcons.certificate className="md:w-8 md:h-8" />),
    name: "Constancia de estudios de la escuela de procedencia",
    type: "Con promedio parcial",
    require: true
  },
  {
    icon: (<AdmissionsIcons.document className="md:w-8 md:h-8" />),
    name: "Número de folio para vales escolares",
    type: "Si aplica",
    require: false
  },
  {
    icon: (<AdmissionsIcons.nationalId className="md:w-8 md:h-8" />),
    name: "CURP del tutor",
    type: "",
    require: true
  },
  {
    icon: (<AdmissionsIcons.photo className="md:w-8 md:h-8" />),
    name: "Fotografía tamaño infantil",
    type: "JPG o PNG",
    require: true
  },
];

export default function Preparation({ nextStep }: Props) {
  return (
    <div className="md:bg-white md:rounded-2xl md:shadow-xl p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-merriweather">
          Estimados Padres, Madres de familia y/o Tutores:
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Antes de iniciar, para agilizar el proceso de preinscripción, asegúrese de tener todos los documentos necesarios preparados
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {documentos.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="text-black flex-shrink-0 mt-1">
                {doc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                {doc.require && (
                  <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Obligatorio
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8"
      >
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Notas importantes:
        </h3>
        <ul className="pl-2 list-disc space-y-2 text-justify text-gray-700">
          <li >
            <span>En caso de pre-inscribir dos o más aspirantes, rellenar el formulario con una cuenta de correo electrónico diferente por cada uno.</span>
          </li>
          <li>
            <span>
              La difusión de la información oficial será a través del Facebook oficial:
            </span>
            <a href="https://www.facebook.com/EscSecTecnica118" target="_blank" rel="noopener noreferrer"
              aria-label="Facebook oficial de la escuela"
              className="block mt-1 text-blue-700 underline font-semibold break-all hover:text-blue-800"
            >
              EscSecTecnica118
            </a>
          </li>
          <li >
            <span>
              Para concluir este trámite es requisito indispensable asistir al área de contraloría en las instalaciones de la escuela en horario de
              <strong>7:15 a 9:30 y de 10:00 a 13:30 horas de lunes a viernes</strong>,
              presentando el número de folio asignado y cubrir la cuota de preinscripción.
            </span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <motion.button
          onClick={nextStep}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
        >
          ✓ Tengo todo listo, comenzar
        </motion.button>
      </motion.div>
    </div>
  );
}
