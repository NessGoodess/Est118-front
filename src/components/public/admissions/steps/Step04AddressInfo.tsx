"use client";
import { useState } from "react";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { addressInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect } from "@/components/ui/forms";
import Header from "../content/header";
import StepNavigation from "../content/StepNavigation";

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
      <Header title= "Datos del Domicilio Actual del Aspirante" description="Información de dirección del aspirante"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputSelect
          label="Vialidad"
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
          label="Nombre de la vialidad"
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
          label="Número exterior"
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
          label="Asentamiento"
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
          label="Nombre del asentamiento"
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
          label="Ciudad"
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
          label="Estado"
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
          label="Código postal"
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

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
