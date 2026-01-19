"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import apiClient, { API_ENDPOINTS } from "@/lib/config/api";
import { AxiosError } from "axios";
import StepNavigation from "../content/StepNavigation";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

// idempotency key
function generateIdempotencyKey(curp: string, contactEmail: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const payload = `${curp}-${contactEmail}-${today}`;

  // Hash simple usando btoa (en producción usar crypto.subtle.digest)
  // Esto crea una key consistente para el mismo CURP+email+día
  return btoa(payload).replace(/[/+=]/g, '').substring(0, 32);
}

export default function Review({ nextStep, prevStep }: Props) {
  const { formData } = useAdmissionsForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const talleres = {
    "CONFECCION_VESTIDO": "Confección del vestido e industria Textil",
    "MAQUINAS_HERRAMIENTAS": "Máquinas, herramientas y sistemas de control",
    "DISEÑO_INDUSTRIAL": "Diseño Industrial",
    "INFORMATICA": "Informática",
  };

  const handleConfirm = async () => {
    if (isSubmitting) {
      return;
    }
    setErrorMessage(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setIsSubmitting(true);

    try {
      const idempotencyKey = generateIdempotencyKey(
        formData.applicantInfo.curp,
        formData.email.contactEmail
      );
      const response = await apiClient.post(
        API_ENDPOINTS.ADMISSION,
        {
          ...formData,
          _idempotency_key: idempotencyKey,
        },
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      );

      if (response.status === 201) {
        const folio = response.data?.folio || response.data?.data?.folio;
        const pdf = response.data?.downloadUrl || response.data?.data?.downloadUrl;

        if (folio) {
          sessionStorage.setItem('admissions_folio', folio);
          sessionStorage.setItem('pdf_link', pdf);
        }

        //resetFormData();

        nextStep();
      } else {
        throw new Error(`Respuesta inesperada del servidor: ${response.status}`);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && ('name' in error || 'code' in error)) {
        const err = error as { name?: string; code?: string };
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return;
        }
      }
      //Axios Error
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message || error.response?.data?.error;

        if (status === 409) {
          setErrorMessage(
            serverMessage ||
            "Ya existe una preinscripción con estos datos. Por favor verifica tu información o contacta al área de admisiones."
          );
        } else if (status === 422) {
          const validationErrors = error.response?.data?.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0] as string[];
            setErrorMessage(firstError?.[0] || "Error de validación en los datos enviados");
          } else {
            setErrorMessage(serverMessage || "Los datos enviados no son válidos. Por favor revisa la información.");
          }
        } else if (status === 429) {
          setErrorMessage("Has realizado demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente.");
        } else if (status === 500) {
          setErrorMessage("Error del servidor. Por favor intenta nuevamente más tarde");
        } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          setErrorMessage("La solicitud tardó demasiado. Por favor verifica tu conexión e intenta nuevamente.");
        } else {
          setErrorMessage(
            serverMessage ||
            error.message ||
            `Error al enviar el formulario. Código: ${status || 'desconocido'}`
          );
        }
      } else {

        const message =
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : null;

        setErrorMessage(message || "Ocurrió un error inesperado. Por favor intenta nuevamente.");
      }
      setIsSubmitting(false);
      console.error("Error al enviar formulario:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">Revisión Final</h2>
        <p className="text-gray-600">Por favor, revise cuidadosamente toda la información antes de confirmar</p>
      </motion.div>

      <div className="space-y-6">
        {/* Email */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Correo Electrónico</h3>
          <p className="text-gray-700">{formData.email.contactEmail}</p>
        </div>

        {/* Aplicant Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos del Aspirante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Nombre completo:</span> {formData.applicantInfo.firstName} {formData.applicantInfo.lastName} {formData.applicantInfo.secondLastName || ''}</div>
            <div><span className="font-semibold">CURP:</span> {formData.applicantInfo.curp}</div>
            <div><span className="font-semibold">Fecha de nacimiento:</span> {formData.applicantInfo.birthDate}</div>
            <div><span className="font-semibold">Edad:</span> {formData.applicantInfo.age} años</div>
            <div><span className="font-semibold">Género:</span> {formData.applicantInfo.gender === 'M' ? 'Masculino' : formData.applicantInfo.gender === 'F' ? 'Femenino' : 'Otro'}</div>
            <div><span className="font-semibold">Teléfono:</span> {formData.applicantInfo.phone}</div>
            {formData.applicantInfo.studentEmail && (
              <div className="md:col-span-2"><span className="font-semibold">Correo:</span> {formData.applicantInfo.studentEmail}</div>
            )}
            <div className="md:col-span-2"><span className="font-semibold">Lugar de nacimiento:</span> {formData.applicantInfo.placeOfBirth}</div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos Educativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Escuela de procedencia:</span> {formData.academicInfo.previousSchool}</div>
            <div><span className="font-semibold">Promedio:</span> {formData.academicInfo.currentAverage.toFixed(1)}</div>
            {formData.academicInfo.hasSiblings && formData.academicInfo.siblingsDetails && (
              <div className="md:col-span-2"><span className="font-semibold">Hermanos:</span> {formData.academicInfo.siblingsDetails}</div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Domicilio</h3>
          <div className="text-sm space-y-1">
            <p>{formData.addressInfo.streetType} {formData.addressInfo.streetName} {formData.addressInfo.houseNumber} {formData.addressInfo.unitNumber ? `Int. ${formData.addressInfo.unitNumber}` : ""}</p>
            <p>{formData.addressInfo.neighborhoodType} {formData.addressInfo.neighborhoodName}</p>
            <p>{formData.addressInfo.city}, {formData.addressInfo.state}. C.P. {formData.addressInfo.postalCode}</p>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Datos del Tutor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Nombre completo:</span> {formData.guardianInfo.guardianFirstName} {formData.guardianInfo.guardianLastName} {formData.guardianInfo.guardianSecondLastName || ''}</div>
            {formData.guardianInfo.guardianCurp && (
              <div><span className="font-semibold">CURP:</span> {formData.guardianInfo.guardianCurp}</div>
            )}
            <div><span className="font-semibold">Parentesco:</span> {formData.guardianInfo.guardianRelationship}</div>
            <div><span className="font-semibold">Teléfono:</span> {formData.guardianInfo.guardianPhone}</div>
          </div>
        </div>

        {/* Workshop Selection */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Taller Seleccionado</h3>
          <div className="text-sm space-y-2">
            <p><span className="font-semibold">Opción favorita:</span> {talleres[formData.workshopSelect.workshopFirstChoice as keyof typeof talleres] || formData.workshopSelect.workshopFirstChoice}</p>
            <p><span className="font-semibold">Segunda opción:</span> {talleres[formData.workshopSelect.workshopSecondChoice as keyof typeof talleres] || formData.workshopSelect.workshopSecondChoice}</p>
          </div>
        </div>

        {/* Tuition Voucher */}
        {formData.tuitionVoucher.hasSchoolVoucher && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Vales Escolares</h3>
            <p className="text-sm"><span className="font-semibold">Folio:</span> {formData.tuitionVoucher.schoolVoucherFolio || 'No proporcionado'}</p>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Importante:</strong> Para concluir este trámite es requisito indispensable asistir al área de contraloría en las instalaciones de la escuela en horario de <strong>7:15 a 9:30 y de 10:00 a 13:30 horas de lunes a viernes</strong>, presentando el número de folio asignado (que recibirá en su correo electrónico) y cubrir la cuota de preinscripción.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-6"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">Error al enviar formulario</h4>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 flex-shrink-0"
              aria-label="Cerrar mensaje de error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleConfirm}
        isSubmitting={isSubmitting}
        nextLabel="Confirmar y Enviar"
        submittingLabel="Enviando..."
        variant="submit"
      />
    </div>
  );
}
