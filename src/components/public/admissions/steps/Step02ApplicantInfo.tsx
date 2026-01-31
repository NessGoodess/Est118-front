"use client";
import { useState, useEffect } from "react";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { applicantInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect } from "@/components/ui/forms";
import { validateCURP, extractDataFromCURP } from "@/lib/utils/curpValidator";
import Header from "../content/header";
import StepNavigation from "../content/StepNavigation";
import { getIcon } from "@/components/ui/icons/public/admission.icons";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function ApplicantInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.applicantInfo.birthDate) {
      const birthDate = new Date(formData.applicantInfo.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age !== formData.applicantInfo.age && age >= 10 && age <= 18) {
        updateFormData({
          applicantInfo: {
            ...formData.applicantInfo,
            age,
          },
        });
      }
    }
  }, [formData.applicantInfo.birthDate, formData.applicantInfo, updateFormData]);

  const handleCURPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
    updateFormData({
      applicantInfo: {
        ...formData.applicantInfo,
        curp: value,
      },
    });

    if (errors.curp) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.curp;
        return newErrors;
      });
    }

    if (value.length === 18) {
      if (validateCURP(value)) {
        const curpData = extractDataFromCURP(value);
        if (curpData) {
          updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              curp: value,
              birthDate: curpData.birthDate,
              gender: curpData.gender === 'MASCULINO' ? 'M' : curpData.gender === 'FEMENINO' ? 'F' : 'O',
              placeOfBirth: curpData.placeOfBirth || formData.applicantInfo.placeOfBirth,
            },
          });
        }
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateFormData({
      applicantInfo: {
        ...formData.applicantInfo,
        phone: value,
      },
    });
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleContinue = () => {
    const result = applicantInfoSchema.safeParse(formData.applicantInfo);
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
      <Header title="Datos Generales del Aspirante" description="Información personal del aspirante" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Apellido Paterno"
          value={formData.applicantInfo.lastName}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              lastName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Ejemplo: GARCÍA"
          error={errors.lastName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-1"
          icon={getIcon('contact')}
        />

        <InputText
          label="Apellido Materno"
          value={formData.applicantInfo.secondLastName || ''}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              secondLastName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Ejemplo: LÓPEZ"
          error={errors.secondLastName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-1"
        />

        <InputText
          label="Nombre(s) Propio(s) sin Apellido(s)"
          value={formData.applicantInfo.firstName}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              firstName: e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, ''),
            },
          })}
          placeholder="Ejemplo: JUAN CARLOS"
          error={errors.firstName}
          required
          helperText="Solo letras en mayúsculas"
          className="md:col-span-2"
        />

        <InputText
          label="CURP del aspirante"
          value={formData.applicantInfo.curp}
          onChange={handleCURPChange}
          placeholder="Ejemplo: GALL991215HOCPRN01"
          maxLength={18}
          error={errors.curp}
          required
          helperText="18 caracteres alfanuméricos en mayúsculas"
          className="md:col-span-2"
          icon={getIcon('nationalId')}
        />

        <InputText
          type="tel"
          label="Teléfono de contacto del aspirante"
          value={formData.applicantInfo.phone}
          onChange={handlePhoneChange}
          placeholder="9511234567"
          maxLength={10}
          error={errors.phone}
          required
          helperText="10 dígitos"
          className="md:col-span-1"
          icon={getIcon('phone')}
        />

        <InputText
          type="email"
          label="Correo electrónico del aspirante"
          value={formData.applicantInfo.studentEmail || ''}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              studentEmail: e.target.value.toLowerCase(),
            },
          })}
          placeholder="correo@ejemplo.com"
          error={errors.studentEmail}
          helperText="Opcional"
          className="md:col-span-1"
          icon={getIcon('email')}
        />

        <InputText
          type="date"
          label="Fecha de nacimiento"
          value={formData.applicantInfo.birthDate}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              birthDate: e.target.value,
            },
          })}
          error={errors.birthDate}
          required
          className="md:col-span-1"
          icon={getIcon('calendar')}
        />

        <InputSelect
          label="Edad del aspirante"
          value={formData.applicantInfo.age.toString()}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              age: parseInt(e.target.value) || 0,
            },
          })}
          error={errors.age}
          required
          placeholder="Seleccionar edad"
          options={Array.from({ length: 15 }, (_, i) => {
            const age = i + 4;
            return { value: age.toString(), label: age.toString() };
          })}
          className="md:col-span-1"
        />

        <InputText
          label="Lugar de nacimiento"
          value={formData.applicantInfo.placeOfBirth}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              placeOfBirth: e.target.value,
            },
          })}
          placeholder="Ciudad, Estado"
          error={errors.placeOfBirth}
          required
          className="md:col-span-1"
          icon={getIcon('location')}
        />

        <InputSelect
          label="Género"
          value={formData.applicantInfo.gender}
          onChange={(e) => updateFormData({
            applicantInfo: {
              ...formData.applicantInfo,
              gender: e.target.value as 'M' | 'F' | 'O',
            },
          })}
          error={errors.gender}
          required
          placeholder="Seleccionar género"
          options={[
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' },
            { value: 'O', label: 'Otro' },
          ]}
          className="md:col-span-1"
        />
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleContinue}
      />

    </div>
  );
}
