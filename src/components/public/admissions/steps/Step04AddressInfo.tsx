"use client";
import { useState, useEffect } from "react";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import { addressInfoSchema } from "@/lib/validations/admissions/admissions.schema";
import { InputText, InputSelect } from "@/components/ui/forms";
import Header from "../content/header";
import StepNavigation from "../content/StepNavigation";
import { STREET_TYPES } from "@/lib/types/street";
import { getInfoByPostalCode, getMunicipios } from "@/lib/Address";

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}

export default function AddressInfo({ nextStep, prevStep }: Props) {
  const { formData, updateFormData } = useAdmissionsForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableColonias, setAvailableColonias] = useState<string[]>([]);
  const [showManualNeighborhood, setShowManualNeighborhood] = useState(false);

  const [municipios, setMunicipios] = useState<string[]>([]);
  const [isManualState, setIsManualState] = useState(false);
  const [isManualCity, setIsManualCity] = useState(false);

  useEffect(() => {
    setMunicipios(getMunicipios());
  }, []);

  // Set defaults on mount
  useEffect(() => {
    if (!formData.addressInfo.state) {
      updateFormData({
        addressInfo: {
          ...formData.addressInfo,
          state: "OAXACA",
          city: formData.addressInfo.city || "OAXACA DE JUAREZ",
        },
      });
    } else {
      // If state is already set and not OAXACA, set manual
      if (formData.addressInfo.state !== "OAXACA") {
        setIsManualState(true);
      }
    }
  }, [formData.addressInfo, updateFormData]);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);

    // Logic for CP lookup
    let newCity = formData.addressInfo.city;
    let newState = formData.addressInfo.state;

    let newColonias: string[] = [];
    let showManualNeigh = true;
    let setManualCity = isManualCity;
    let setManualState = isManualState;

    const info = value.length === 5 ? getInfoByPostalCode(value) : null;

    if (info) {
      newColonias = info.colonias;
      showManualNeigh = false;

      // Force state to Oaxaca if found in Oaxaca JSON
      newState = "OAXACA";
      setManualState = false;

      const foundMunicipality = municipios.find(m => m.toUpperCase() === info.municipio.toUpperCase());
      if (foundMunicipality) {
        newCity = foundMunicipality; // Keep original casing from list
        setManualCity = false;
      } else {
        newCity = info.municipio;
      }
    } else {
      newColonias = [];
      showManualNeigh = true;
    }

    setAvailableColonias(newColonias);
    setShowManualNeighborhood(showManualNeigh);
    setIsManualState(setManualState);
    setIsManualCity(setManualCity);

    updateFormData({
      addressInfo: {
        ...formData.addressInfo,
        postalCode: value,
        city: newCity,
        state: newState,
        neighborhoodName: showManualNeigh ? formData.addressInfo.neighborhoodName : '',
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
      <Header title="Datos del Domicilio Actual del Aspirante" description="Información de dirección del aspirante" />

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
          options={STREET_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
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

        {!showManualNeighborhood && availableColonias.length > 0 ? (
          <InputSelect
            label="Nombre del asentamiento"
            value={formData.addressInfo.neighborhoodName}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'OTRO') {
                setShowManualNeighborhood(true);
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    neighborhoodName: '',
                  }
                });
              } else {
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    neighborhoodName: val,
                  }
                });
              }
            }}
            error={errors.neighborhoodName}
            required
            placeholder="Seleccionar asentamiento"
            options={[
              ...availableColonias.map(c => ({ value: c, label: c })),
              { value: 'OTRO', label: 'Otro (Escribir manual)' }
            ]}
            className="md:col-span-1"
          />
        ) : (
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
        )}

        {!isManualCity && !isManualState ? (
          <InputSelect
            label="Ciudad"
            value={formData.addressInfo.city}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'OTRO') {
                setIsManualCity(true);
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    city: '',
                  }
                });
              } else {
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    city: val,
                  }
                });
              }
            }}
            error={errors.city}
            required
            placeholder="Seleccionar ciudad"
            options={[
              ...municipios.map(m => ({ value: m, label: m })),
              { value: 'OTRO', label: 'Otro' }
            ]}
            className="md:col-span-1"
          />
        ) : (
          <InputText
            label="Ciudad"
            value={formData.addressInfo.city}
            onChange={(e) => updateFormData({
              addressInfo: {
                ...formData.addressInfo,
                city: e.target.value.toUpperCase(),
              },
            })}
            placeholder="Ciudad"
            error={errors.city}
            required
            className="md:col-span-1"
          />
        )}

        {!isManualState ? (
          <InputSelect
            label="Estado"
            value={formData.addressInfo.state}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'OTRO') {
                setIsManualState(true);
                setIsManualCity(true); // If state is manual, city must be manual
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    state: '',
                    city: ''
                  }
                });
              } else {
                updateFormData({
                  addressInfo: {
                    ...formData.addressInfo,
                    state: val,
                  }
                });
              }
            }}
            error={errors.state}
            required
            placeholder="Seleccionar estado"
            options={[
              { value: 'OAXACA', label: 'Oaxaca' },
              { value: 'OTRO', label: 'Otro' },
            ]}
            className="md:col-span-1"
          />
        ) : (
          <InputText
            label="Estado"
            value={formData.addressInfo.state}
            onChange={(e) => updateFormData({
              addressInfo: {
                ...formData.addressInfo,
                state: e.target.value.toUpperCase(),
              },
            })}
            placeholder="Estado"
            error={errors.state}
            required
            className="md:col-span-1"
          />
        )}

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
