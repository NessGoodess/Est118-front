"use client";
import { motion } from "framer-motion";
import { FormData } from "@/lib/types/preregistration";

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function Paso9Revision({ formData, nextStep, prevStep }: Props) {
  const talleres = {
    "CONFECCION_VESTIDO": "Confección del vestido e industria Textil",
    "MAQUINAS_HERRAMIENTAS": "Máquinas, herramientas y sistemas de control",
    "DISEÑO_INDUSTRIAL": "Diseño Industrial",
    "INFORMATICA": "Informática",
  };

  const handleConfirm = async () => {
    // Aquí iría la lógica para enviar el formulario al backend
    // Por ahora simulamos el envío
    console.log("Enviando formulario:", formData);
    // Generar folio (simulado) - en producción esto vendría del backend
    const folio = `2025-118-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    updateFormData({ folioPreinscripcion: folio });
    // Aquí se enviaría el correo con el folio
    nextStep(); // Ir al paso de confirmación
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Revisión Final</h2>
        <p className="text-gray-600">Por favor, revise cuidadosamente toda la información antes de confirmar</p>
      </motion.div>

      <div className="space-y-6">
        {/* Correo */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Correo Electrónico</h3>
          <p className="text-gray-700">{formData.email}</p>
        </div>

        {/* Datos del Aspirante */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos del Aspirante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Nombre completo:</span> {formData.nombres} {formData.apellidoPaterno} {formData.apellidoMaterno}</div>
            <div><span className="font-semibold">CURP:</span> {formData.curpAspirante}</div>
            <div><span className="font-semibold">Fecha de nacimiento:</span> {formData.fechaNacimiento}</div>
            <div><span className="font-semibold">Edad:</span> {formData.age} años</div>
            <div><span className="font-semibold">Género:</span> {formData.genero}</div>
            <div><span className="font-semibold">Teléfono:</span> {formData.telefonoAspirante}</div>
            <div className="md:col-span-2"><span className="font-semibold">Correo:</span> {formData.emailAspirante}</div>
          </div>
        </div>

        {/* Datos Educativos */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos Educativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Escuela de procedencia:</span> {formData.escuelaProcedencia}</div>
            <div><span className="font-semibold">Promedio:</span> {formData.promedio}</div>
            {formData.tieneHermanos === "SI" && (
              <div className="md:col-span-2"><span className="font-semibold">Hermanos:</span> {formData.hermanosInfo}</div>
            )}
          </div>
        </div>

        {/* Domicilio */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Domicilio</h3>
          <div className="text-sm space-y-1">
            <p>{formData.vialidad} {formData.nombreVialidad} {formData.numeroExterior} {formData.numeroInterior ? `Int. ${formData.numeroInterior}` : ""}</p>
            <p>{formData.asentamiento} {formData.nombreAsentamiento}</p>
            <p>{formData.municipio}, Oaxaca. C.P. {formData.codigoPostal}</p>
          </div>
        </div>

        {/* Datos del Tutor */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos del Tutor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Nombre completo:</span> {formData.nombresTutor} {formData.apellidoPaternoTutor} {formData.apellidoMaternoTutor}</div>
            <div><span className="font-semibold">CURP:</span> {formData.curpTutor}</div>
            <div><span className="font-semibold">Parentesco:</span> {formData.parentesco}</div>
            <div><span className="font-semibold">Teléfono:</span> {formData.telefonoTutor}</div>
            <div className="md:col-span-2"><span className="font-semibold">Correo:</span> {formData.emailTutor}</div>
          </div>
        </div>

        {/* Taller */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Taller Seleccionado</h3>
          <div className="text-sm space-y-2">
            <p><span className="font-semibold">Opción favorita:</span> {talleres[formData.tallerFavorito as keyof typeof talleres] || formData.tallerFavorito}</p>
            <p><span className="font-semibold">Segunda opción:</span> {talleres[formData.segundaOpcion as keyof typeof talleres] || formData.segundaOpcion}</p>
          </div>
        </div>

        {/* Vales */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Vales Escolares</h3>
          <p className="text-sm"><span className="font-semibold">Folio:</span> {formData.folioVales}</p>
        </div>

        {/* Documentos */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Documentos</h3>
          <div className="text-sm space-y-1">
            <p>{formData.actaNacimiento ? "✓ Acta de nacimiento: " + formData.actaNacimiento.name : "✗ Acta de nacimiento"}</p>
            <p>{formData.curpDocumento ? "✓ CURP: " + formData.curpDocumento.name : "✗ CURP"}</p>
            <p>{formData.comprobanteDomicilio ? "✓ Comprobante de domicilio: " + formData.comprobanteDomicilio.name : "✗ Comprobante de domicilio"}</p>
            <p>{formData.constanciaEstudios ? "✓ Constancia de estudios: " + formData.constanciaEstudios.name : "✗ Constancia de estudios"}</p>
            <p>{formData.fotografiaInfantil ? "✓ Fotografía infantil: " + formData.fotografiaInfantil.name : "✗ Fotografía infantil"}</p>
          </div>
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Importante:</strong> Para concluir este trámite es requisito indispensable asistir al área de contraloría en las instalaciones de la escuela en horario de <strong>7:15 a 9:30 y de 10:00 a 13:30 horas de lunes a viernes</strong>, presentando el número de folio asignado (que recibirá en su correo electrónico) y cubrir la cuota de preinscripción.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button onClick={prevStep} className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold">← Atrás</button>
        <motion.button
          onClick={handleConfirm}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg shadow-lg"
        >
          ✓ Confirmar y Enviar
        </motion.button>
      </div>
    </div>
  );
}

