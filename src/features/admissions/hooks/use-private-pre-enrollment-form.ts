"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  formDataSchema,
  type FormData,
} from "@/features/admissions/validations/admissions.schema";
import { defaultFormData } from "@/features/admissions/types/admission";
import { createPreEnrollmentByAdmin } from "@/features/admissions/services/admissions.service";
import { globalToast } from "@/lib/toast";
import { handleApiError } from "@/lib/api";
import { useConfirm } from "@/components/ui/confirm";

const DRAFT_KEY = "private_new_preenrollment_draft";
const ACTIVE_TAB_KEY = "activeTab";

export const PRIVATE_PRE_ENROLLMENT_TABS = [
  { id: 0, label: "Correo", key: "email" },
  { id: 1, label: "Aspirante", key: "applicantInfo" },
  { id: 2, label: "Educación", key: "academicInfo" },
  { id: 3, label: "Domicilio", key: "addressInfo" },
  { id: 4, label: "Tutor", key: "guardianInfo" },
  { id: 5, label: "Taller", key: "workshopSelect" },
  { id: 6, label: "Vales", key: "tuitionVoucher" },
] as const;

const TAB_ERROR_KEYS: Record<number, keyof FormData> = Object.fromEntries(
  PRIVATE_PRE_ENROLLMENT_TABS.map((tab) => [tab.id, tab.key])
) as Record<number, keyof FormData>;

export type PrivatePreEnrollmentSuccessResult = {
  folio: string;
  downloadUrl: string;
  message: string;
};

function countCompletion(data: FormData): number {
  let filledCount = 0;
  let totalCount = 0;

  const countFields = (obj: Record<string, unknown> | unknown) => {
    if (!obj) return;
    Object.values(obj as Record<string, unknown>).forEach((val) => {
      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        countFields(val);
      } else {
        totalCount++;
        if (val !== "" && val !== null && val !== undefined && val !== false) {
          filledCount++;
        }
      }
    });
  };

  countFields(data);
  if (totalCount === 0) return 0;
  return Math.round((filledCount / totalCount) * 100);
}

type UsePrivatePreEnrollmentFormOptions = {
  onCreated?: () => void;
};

export function usePrivatePreEnrollmentForm(
  options: UsePrivatePreEnrollmentFormOptions = {}
) {
  const { onCreated } = options;
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(sessionStorage.getItem(ACTIVE_TAB_KEY) || "0", 10);
    }
    return 0;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] =
    useState<PrivatePreEnrollmentSuccessResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange",
    defaultValues: defaultFormData,
  });

  const {
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      reset(JSON.parse(draft));
    } catch (e) {
      console.error("Error parsing draft", e);
    }
  }, [reset]);

  const currentData = watch();
  const completionPercentage = useMemo(
    () => countCompletion(currentData),
    [currentData]
  );
  const hasFormErrors = Object.keys(errors).length > 0;

  const saveDraft = () => {
    setIsSaving(true);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(getValues()));
    setTimeout(() => setIsSaving(false), 800);
    globalToast.success("Exito:", "Formulario guardado temporalmente");
  };

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab);
    sessionStorage.setItem(ACTIVE_TAB_KEY, newTab.toString());
  };

  const hasErrorsInTab = (tabId: number) =>
    !!errors[TAB_ERROR_KEYS[tabId]];

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const result = await createPreEnrollmentByAdmin(data, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      globalToast.success(
        "Exito:",
        result.message || "Preinscripción creada correctamente"
      );

      setSuccessResult(result);
      setPreviewUrl(null);
      setPdfError(null);
      reset();
      setActiveTab(0);
      sessionStorage.setItem(ACTIVE_TAB_KEY, "0");
      onCreated?.();
    } catch (error) {
      const err = error as { name?: string; message?: string };
      console.error("Error al enviar el formulario", error);
      if (err.name === "AbortError" || err.message === "canceled") {
        globalToast.error(
          "Error:",
          "La petición tomó demasiado tiempo. Intenta nuevamente."
        );
      } else {
        const apiError = handleApiError(error);
        globalToast.error(
          "Error:",
          apiError.message || "Ocurrió un error al crear la preinscripción"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: Record<string, unknown>) => {
    const firstErrorTab = Object.keys(TAB_ERROR_KEYS).find(
      (tabId) => formErrors[TAB_ERROR_KEYS[parseInt(tabId, 10)]]
    );
    if (firstErrorTab !== undefined) {
      const tabIndex = parseInt(firstErrorTab, 10);
      setActiveTab(tabIndex);
      sessionStorage.setItem(ACTIVE_TAB_KEY, firstErrorTab);
      setTimeout(() => {
        const tabKey = TAB_ERROR_KEYS[tabIndex];
        const firstErrorField = Object.keys(
          (formErrors[tabKey] as Record<string, unknown>) || {}
        )[0];
        if (firstErrorField) {
          const element =
            document.getElementsByName(`${tabKey}.${firstErrorField}`)[0] ||
            document.getElementById(firstErrorField);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
    globalToast.error(
      "Info",
      "Corrige los errores antes de enviar. Verifica la pestaña marcada."
    );
  };

  const handlePreview = async () => {
    if (!successResult?.downloadUrl) return;
    try {
      setIsPreviewLoading(true);
      setPreviewUrl(null);
      const res = await axios.get(successResult.downloadUrl, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      setPreviewUrl(URL.createObjectURL(blob));
      setPdfError(null);
    } catch {
      setPdfError("Error al cargar PDF o enlace expirado");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const dismissSuccess = () => {
    setSuccessResult(null);
    setPreviewUrl(null);
    setPdfError(null);
  };

  const handleClearForm = () => {
    confirm({
      title: "Limpiar formulario",
      description: "¿Estás seguro de que deseas limpiar el formulario?",
      confirmLabel: "Limpiar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        try {
          localStorage.removeItem(DRAFT_KEY);
          sessionStorage.removeItem(ACTIVE_TAB_KEY);
          reset(defaultFormData);
          setActiveTab(0);
          globalToast.success("Formulario limpiado", "El formulario se limpió.");
        } catch {
          globalToast.error(
            "Error al limpiar",
            "No se pudo limpiar el formulario."
          );
        }
      },
    });
  };

  return {
    methods,
    activeTab,
    isSaving,
    isSubmitting,
    successResult,
    previewUrl,
    pdfError,
    isPreviewLoading,
    completionPercentage,
    hasFormErrors,
    errors,
    tabs: PRIVATE_PRE_ENROLLMENT_TABS,
    handleTabChange,
    hasErrorsInTab,
    saveDraft,
    handleClearForm,
    handlePreview,
    dismissSuccess,
    onSubmit: handleSubmit(onSubmit, onError),
  };
}
