"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formDataSchema, FormData } from "@/lib/validations/admissions/admissions.schema";
import { defaultFormData } from "@/lib/types/admission/admission";
import { createPreEnrollmentByAdmin } from "@/lib/services/admissions.service";
import { TabEmail, TabApplicantInfo, TabAcademicInfo, TabAddressInfo, TabGuardianInfo, TabWorkshopSelect, TabTuitionVoucher } from "./tabs";
import { globalToast } from '@/lib/toast';
import axios from "axios";
import { handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useConfirm } from "@/components/ui/confirm";

const DRAFT_KEY = "private_new_preenrollment_draft";

export default function PrivatePreEnrollmentTabs() {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(sessionStorage.getItem('activeTab') || '0');
        }
        return 0;
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successResult, setSuccessResult] = useState<{ folio: string, downloadUrl: string, message: string } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const { confirm } = useConfirm();

    const methods = useForm<FormData>({
        resolver: zodResolver(formDataSchema),
        mode: "onChange",
        defaultValues: defaultFormData
    });

    const { handleSubmit, watch, reset, getValues, formState: { errors } } = methods;

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                reset(parsedDraft);
            } catch (e) {
                console.error("Error parsing draft", e);
            }
        }
    }, [reset]);



    // Save draft manually
    const saveDraft = () => {
        setIsSaving(true);
        const currentData = getValues();
        localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));
        setTimeout(() => setIsSaving(false), 800);
        globalToast.success("Exito:", "Formulario guardado temporalmente");
    };

    // Handle tab change
    const handleTabChange = (newTab: number) => {
        setActiveTab(newTab);
        sessionStorage.setItem('activeTab', newTab.toString());
    };

    // Tab error keys
    const tabErrorKeys: Record<number, string> = {
        0: 'email', 1: 'applicantInfo', 2: 'academicInfo',
        3: 'addressInfo', 4: 'guardianInfo', 5: 'workshopSelect', 6: 'tuitionVoucher'
    };

    // Check if tab has errors
    const hasErrorsInTab = (tabId: number) => {
        return !!errors[tabErrorKeys[tabId] as keyof typeof errors];
    };


    // Get current data
    const currentData = watch();

    // Calculate completion percentage
    const completionPercentage = useMemo(() => {
        if (!currentData) return 0;
        let filledCount = 0;
        let totalCount = 0;
        const countFields = (obj: Record<string, unknown> | unknown) => {
            if (!obj) return;
            Object.values(obj as Record<string, unknown>).forEach(val => {
                if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                    countFields(val);
                } else {
                    totalCount++;
                    if (val !== '' && val !== null && val !== undefined && val !== false) {
                        filledCount++;
                    }
                }
            });
        };
        countFields(currentData);
        if (totalCount === 0) return 0;
        return Math.round((filledCount / totalCount) * 100);
    }, [currentData]);

    // Submit form
    const onSubmit = async (data: FormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const result = await createPreEnrollmentByAdmin(data, { signal: controller.signal });
            clearTimeout(timeoutId);

            globalToast.success("Exito:", result.message || "Preinscripción creada correctamente");

            setSuccessResult(result);
            setPreviewUrl(null);
            setPdfError(null);

            reset();
            setActiveTab(0);
        } catch (error) {
            const err = error as { name?: string; message?: string };
            console.error("Error al enviar el formulario", error);
            if (err.name === 'AbortError' || err.message === 'canceled') {
                globalToast.error("Error:", "La petición tomó demasiado tiempo. Intenta nuevamente.");
            } else {
                const apiError = handleApiError(error);
                globalToast.error("Error:", apiError.message || "Ocurrió un error al crear la preinscripción");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle preview
    async function handlePreview() {
        if (!successResult?.downloadUrl) return;
        try {
            setIsPreviewLoading(true);
            setPreviewUrl(null);
            const res = await axios.get(successResult.downloadUrl, { responseType: "blob" });
            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPdfError(null);
        } catch {
            setPdfError("Error al cargar PDF o enlace expirado");
        } finally {
            setIsPreviewLoading(false);
        }
    }

    // Handle form errors
    const onError = (formErrors: Record<string, unknown>) => {
        const firstErrorTab = Object.keys(tabErrorKeys).find(tabId =>
            formErrors[tabErrorKeys[parseInt(tabId)]]
        );
        if (firstErrorTab !== undefined) {
            setActiveTab(parseInt(firstErrorTab));
            setTimeout(() => {
                const tabKey = tabErrorKeys[parseInt(firstErrorTab)];
                const firstErrorField = Object.keys((formErrors[tabKey] as Record<string, unknown>) || {})[0];
                if (firstErrorField) {
                    const element = document.getElementsByName(`${tabKey}.${firstErrorField}`)[0] || document.getElementById(firstErrorField);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
        globalToast.error("Info", "Corrige los errores antes de enviar. Verifica la pestaña marcada.");
    };

    // Tabsgt
    const tabs = [
        { id: 0, label: "Correo" },
        { id: 1, label: "Aspirante" },
        { id: 2, label: "Educación" },
        { id: 3, label: "Domicilio" },
        { id: 4, label: "Tutor" },
        { id: 5, label: "Taller" },
        { id: 6, label: "Vales" }
    ];

    const HandleClearForm = async () => {
        confirm({
            title: 'Limpiar formulario',
            description: `¿Estás seguro de que deseas limpiar el formulario?`,
            confirmLabel: 'Limpiar',
            cancelLabel: 'Cancelar',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    localStorage.removeItem(DRAFT_KEY);
                    sessionStorage.removeItem('activeTab');
                    reset(defaultFormData);
                    setActiveTab(0);
                    globalToast.success("Formulario limpiado", "El formulario se limpió.");
                } catch (err) {
                    globalToast.error("Error al limpiar", "No se pudo limpiar el formulario.");
                }
            }
        });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6" noValidate>

                {/* Save Draft Header / Global Actions */}
                <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            {Object.keys(errors).length > 0 && <span className="text-red-500 font-semibold">Existen errores en el formulario. </span>}
                            {Object.keys(errors).length === 0 ? "Completa la información necesaria." : "Revisa las pestañas marcadas para corregirlos."}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={HandleClearForm}
                            >Limpiar formulario</Button>
                            <Button
                                variant="secondary"
                                loading={isSaving}
                                loadingText="Guardando..."
                                onClick={saveDraft}
                            >Guardar formulario</Button>
                        </div>
                    </div>

                </div>

                {/* Professional Tabs Layout */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-900 h-1 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }} />
                    </div>
                    <div className="flex border-b border-gray-200 bg-gray-50 justify-between">
                        <div className="flex overflow-x-auto hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === tab.id
                                        ? "border-blue-500 text-blue-900 bg-white"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } ${hasErrorsInTab(tab.id) ? 'border-red-500 text-red-600 font-bold bg-red-50' : ''}`}
                                >
                                    {tab.label}
                                    {hasErrorsInTab(tab.id) && <span className="text-red-500" title="Contiene errores">*</span>}
                                </button>
                            ))}
                        </div>
                        <span className="px-6 py-3 text-xs text-gray-500 mt-1 inline-block">{completionPercentage}% completado</span>
                    </div>

                    <div className="p-2 md:p-4 lg:p-6 bg-gray-100">
                        {activeTab === 0 && <TabEmail />}
                        {activeTab === 1 && <TabApplicantInfo />}
                        {activeTab === 2 && <TabAcademicInfo />}
                        {activeTab === 3 && <TabAddressInfo />}
                        {activeTab === 4 && <TabGuardianInfo />}
                        {activeTab === 5 && <TabWorkshopSelect />}
                        {activeTab === 6 && <TabTuitionVoucher />}
                    </div>
                    {/* Progress Bar */}
                </div>

                {/* Main Submit */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        loadingText="Registrando..."
                        disabled={isSaving}
                    >Registrar</Button>
                </div>

                {/* Success Block */}
                {successResult && (
                    <div className="mt-8 bg-white border-2 border-blue-900 rounded-xl p-6 md:p-8 relative">
                        <button
                            type="button"
                            onClick={() => { setSuccessResult(null); setPreviewUrl(null); }}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-merriweather text-center">
                            ¡Preinscripción Completada!
                        </h3>
                        <p className="text-center text-sm text-gray-600 mb-6">{successResult.message}</p>

                        <div className="bg-white rounded-lg p-4 mb-6 text-center mx-auto max-w-sm shadow-sm border border-blue-100">
                            <p className="text-sm text-gray-500 mb-1">Folio de Preinscripción</p>
                            <p className="text-3xl font-bold text-blue-900 font-mono tracking-wider">{successResult.folio}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="secondary"
                                loading={isPreviewLoading}
                                loadingText="Cargando PDF..."
                                onClick={handlePreview}
                            >Previsualizar Comprobante</Button>
                            <Link
                                href={successResult.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-2 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-950 font-medium transition-colors text-center shadow-sm cursor-pointer active:bg-black"
                            >
                                Descargar PDF Comprobante
                            </Link>
                        </div>

                        {pdfError && <p className="text-center text-red-500 font-medium mt-4 bg-red-50 p-2 rounded">{pdfError}</p>}

                        {previewUrl && !pdfError && (
                            <div className="mt-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200 h-[600px] md:h-[800px]">
                                <object data={previewUrl} type="application/pdf" className="w-full h-full rounded">
                                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 h-full">
                                        <p className="mb-2 text-gray-600 font-medium">Tu navegador no puede previsualizar PDFs incrustados.</p>
                                        <a href={successResult.downloadUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">Descargar el archivo PDF aquí</a>
                                    </div>
                                </object>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </FormProvider>
    );
}


