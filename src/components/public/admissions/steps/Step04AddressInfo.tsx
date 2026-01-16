"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { addressInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect } from "@/components/ui/forms";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function AddressInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({
      addressInfo: {
        ...formData.addressInfo,
        postalCode: value,
      },
    });
    if (errors.postalCode) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.postalCode;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    const result = addressInfoSchema.safeParse(formData.addressInfo);
    if (result.success) {
      setErrors({});
      nextStep();
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-merriweather">
          Datos del Domicilio Actual del Aspirante
        </h2>
        <p className="text-gray-600">Información de dirección del aspirante</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputSelect
          label="Vialidad *"
          value={formData.addressInfo.streetType}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              streetType: e.target.value,
            },
          })}
          error={errors.streetType}
          required
          placeholder="Seleccionar tipo"
          options={[
            { value: 'CALLE', label: 'Calle' },
            { value: 'AVENIDA', label: 'Avenida' },
            { value: 'BOULEVARD', label: 'Boulevard' },
            { value: 'PRIVADA', label: 'Privada' },
            { value: 'OTRO', label: 'Otro' },
          ]}
          className="md:col-span-1"
        />

        <InputText
          label="Nombre de la vialidad *"
          value={formData.addressInfo.streetName}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              streetName: e.target.value.toUpperCase(),
            },
          })}
          placeholder="Nombre de la calle"
          error={errors.streetName}
          required
          className="md:col-span-1"
        />

        <InputText
          label="Número exterior *"
          value={formData.addressInfo.houseNumber}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              houseNumber: e.target.value,
            },
          })}
          placeholder="123"
          error={errors.houseNumber}
          required
          className="md:col-span-1"
        />

        <InputText
          label="Número interior"
          value={formData.addressInfo.unitNumber || ''}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              unitNumber: e.target.value,
            },
          })}
          placeholder="Apto. 5"
          error={errors.unitNumber}
          helperText="Opcional"
          className="md:col-span-1"
        />

        <InputSelect
          label="Asentamiento *"
          value={formData.addressInfo.neighborhoodType}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              neighborhoodType: e.target.value,
            },
          })}
          error={errors.neighborhoodType}
          required
          placeholder="Seleccionar tipo"
          options={[
            { value: 'COLONIA', label: 'Colonia' },
            { value: 'FRACCIONAMIENTO', label: 'Fraccionamiento' },
            { value: 'UNIDAD', label: 'Unidad' },
            { value: 'OTRO', label: 'Otro' },
          ]}
          className="md:col-span-1"
        />

        <InputText
          label="Nombre del asentamiento *"
          value={formData.addressInfo.neighborhoodName}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              neighborhoodName: e.target.value.toUpperCase(),
            },
          })}
          placeholder="Nombre de la colonia"
          error={errors.neighborhoodName}
          required
          className="md:col-span-1"
        />

        <InputSelect
          label="Ciudad *"
          value={formData.addressInfo.city}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              city: e.target.value,
            },
          })}
          error={errors.city}
          required
          placeholder="Seleccionar ciudad"
          options={[
            { value: 'OAXACA DE JUAREZ', label: 'Oaxaca de Juárez' },
            { value: 'OTRO', label: 'Otro' },
          ]}
          className="md:col-span-1"
        />

        <InputText
          label="Estado *"
          value={formData.addressInfo.state}
          onChange={(e) => updateFormData({
            addressInfo: {
              ...formData.addressInfo,
              state: e.target.value.toUpperCase(),
            },
          })}
          placeholder="Oaxaca"
          error={errors.state}
          required
          className="md:col-span-1"
        />

        <InputText
          label="Código postal *"
          value={formData.addressInfo.postalCode}
          onChange={handlePostalCodeChange}
          placeholder="68000"
          maxLength={5}
          error={errors.postalCode}
          required
          helperText={
            <>
              Consultar en:{" "}
              <a
                href="https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/Descarga.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Correos de México
              </a>
            </>
          }
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          ← Atrás
        </button>
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-full font-bold text-lg transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
        >
          Continuar →
        </motion.button>
      </div>
    </div>
  );
}
