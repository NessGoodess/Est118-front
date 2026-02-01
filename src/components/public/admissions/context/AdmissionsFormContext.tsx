"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { initialFormData } from "../content/initialFormData";

interface AdmissionsFormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  completeSteps: number[];
  markStepCompleted: (step: number) => void;
}

const AdmissionsFormContext = createContext<AdmissionsFormContextType | undefined>(undefined);

const STORAGE_KEY = "admissions_form_data";

export function AdmissionsFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [completeSteps, setCompleteSteps] = useState<number[]>([]);

  const markStepCompleted = (step: number) => {
    setCompleteSteps((prev) => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  };

  // Cargar datos del localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setFormData({ ...initialFormData, ...parsed });
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);

      setFormData(initialFormData);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Guardar en localStorage cada vez que cambie formData
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    }
  }, [formData, isHydrated]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      // Actualizar datos anidados correctamente
      const updated: FormData = { ...prev };
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof FormData;
        const newValue = data[typedKey];
        const prevValue = prev[typedKey];

        if (newValue && typeof newValue === "object" && !Array.isArray(newValue) && prevValue && typeof prevValue === "object" && !Array.isArray(prevValue)) {
          // Si es un objeto anidado, hacer merge
          (updated as Record<string, unknown>)[typedKey] = { ...prevValue, ...newValue };
        } else if (newValue !== undefined) {
          // Si es un valor simple o se está reemplazando completamente
          (updated as Record<string, unknown>)[typedKey] = newValue;
        }
      });
      return updated;
    });
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error removing form data from localStorage:", error);
    }
  };

  // Siempre proporcionar el contexto, incluso antes de la hidratación
  return (
    <AdmissionsFormContext.Provider value={{ formData, updateFormData, resetFormData, completeSteps, markStepCompleted }}>
      {children}
    </AdmissionsFormContext.Provider>
  );
}

export function useAdmissionsForm() {
  const context = useContext(AdmissionsFormContext);
  if (context === undefined) {
    throw new Error("useAdmissionsForm must be used within an AdmissionsFormProvider");
  }
  return context;
}

