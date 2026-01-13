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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileState {
  file: File | null;
  error: string;
  uploading: boolean;
}

export default function Paso8Documentos({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [files, setFiles] = useState<{ [key: string]: FileState }>({
    actaNacimiento: { file: formData.actaNacimiento, error: "", uploading: false },
    curpDocumento: { file: formData.curpDocumento, error: "", uploading: false },
    comprobanteDomicilio: { file: formData.comprobanteDomicilio, error: "", uploading: false },
    constanciaEstudios: { file: formData.constanciaEstudios, error: "", uploading: false },
    fotografiaInfantil: { file: formData.fotografiaInfantil, error: "", uploading: false },
  });

  const documentos = [
    {
      key: "actaNacimiento" as const,
      nombre: "Acta de nacimiento del aspirante",
      acepta: ".pdf,.jpg,.jpeg,.png",
      requerido: true
    },
    {
      key: "curpDocumento" as const,
      nombre: "CURP del aspirante (documento)",
      acepta: ".pdf,.jpg,.jpeg,.png",
      requerido: true
    },
    {
      key: "comprobanteDomicilio" as const,
      nombre: "Comprobante de domicilio",
      acepta: ".pdf,.jpg,.jpeg,.png",
      requerido: true
    },
    {
      key: "constanciaEstudios" as const,
      nombre: "Constancia de estudios con promedio",
      acepta: ".pdf,.jpg,.jpeg,.png",
      requerido: true
    },
    {
      key: "fotografiaInfantil" as const,
      nombre: "Fotografía tamaño infantil",
      acepta: ".jpg,.jpeg,.png",
      requerido: true
    },
  ];

  const handleFileChange = (key: keyof typeof files, file: File | null) => {
    if (!file) {
      setFiles(prev => ({ ...prev, [key]: { file: null, error: "", uploading: false } }));
      updateFormData({ [key]: null } as Partial<FormData>);
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      setFiles(prev => ({
        ...prev,
        [key]: { file: null, error: `El archivo excede el tamaño máximo de 5MB`, uploading: false }
      }));
      return;
    }

    // Validar tipo
    const doc = documentos.find(d => d.key === key);
    if (doc) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const tiposPermitidos = doc.acepta.split(',');
      if (!tiposPermitidos.includes(extension)) {
        setFiles(prev => ({
          ...prev,
          [key]: { file: null, error: `Tipo de archivo no permitido. Acepta: ${doc.acepta}`, uploading: false }
        }));
        return;
      }
    }

    setFiles(prev => ({ ...prev, [key]: { file, error: "", uploading: false } }));
    updateFormData({ [key]: file } as Partial<FormData>);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const canContinue = documentos.every(doc => files[doc.key].file !== null && !files[doc.key].error);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">
          Documentos Requeridos
        </h2>
        <p className="text-gray-600">
          Suba los documentos escaneados o fotografías de buena calidad (máximo 5MB cada uno)
        </p>
      </motion.div>

      <div className="space-y-6">
        {documentos.map((doc) => {
          const fileState = files[doc.key];
          return (
            <div key={doc.key} className="border-2 border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {doc.nombre} {doc.requerido && <span className="text-red-600">*</span>}
              </label>
              <p className="text-xs text-gray-500 mb-4">Formatos aceptados: {doc.acepta} (Máx. 5MB)</p>

              <div className="relative">
                <input
                  type="file"
                  id={doc.key}
                  accept={doc.acepta}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileChange(doc.key, file);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor={doc.key}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {fileState.file ? (
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{fileState.file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(fileState.file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileChange(doc.key, null);
                          const input = document.getElementById(doc.key) as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">Haga clic para seleccionar o arrastre el archivo aquí</p>
                    </>
                  )}
                </label>
              </div>

              {fileState.error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fileState.error}
                </p>
              )}
            </div>
          );
        })}
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

