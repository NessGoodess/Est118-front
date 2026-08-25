"use client";

import { FormProvider } from "react-hook-form";
import { TabEmail, TabApplicantInfo, TabAcademicInfo, TabAddressInfo, TabGuardianInfo, TabWorkshopSelect, TabTuitionVoucher, } from "./tabs";
import { Button } from "@/components/ui/Button";
import { usePrivatePreEnrollmentForm } from "@/features/admissions/hooks/use-private-pre-enrollment-form";
import PrivatePreEnrollmentSuccessPanel from "./private-pre-enrollment-success-panel";

const TAB_PANELS = [
    TabEmail, TabApplicantInfo, TabAcademicInfo, TabAddressInfo, TabGuardianInfo, TabWorkshopSelect, TabTuitionVoucher,
] as const;

type PrivatePreEnrollmentTabsProps = {
    onCreated?: () => void;
    onFinished?: () => void;
};

export default function PrivatePreEnrollmentTabs({
    onCreated,
    onFinished,
}: PrivatePreEnrollmentTabsProps) {
    const { methods, activeTab, isSaving, isSubmitting, successResult, previewUrl, pdfError, isPreviewLoading, completionPercentage, hasFormErrors, tabs,
        handleTabChange, hasErrorsInTab, saveDraft, handleClearForm, handlePreview, dismissSuccess, onSubmit,
    } = usePrivatePreEnrollmentForm({ onCreated });

    const ActivePanel = TAB_PANELS[activeTab] ?? TabEmail;

    const handleDismissSuccess = () => {
        dismissSuccess();
        onFinished?.();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
                <div className="flex flex-col gap-4 bg-surface-elevated p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-fg-muted">
                            {hasFormErrors && (
                                <span className="text-danger font-semibold">
                                    Existen errores en el formulario.{" "}
                                </span>
                            )}
                            {hasFormErrors
                                ? "Revisa las pestañas marcadas para corregirlos."
                                : "Completa la información necesaria."}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" type="button" onClick={handleClearForm}>
                                Limpiar formulario
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                loading={isSaving}
                                loadingText="Guardando..."
                                onClick={saveDraft}
                            >
                                Guardar formulario
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-elevated rounded-lg shadow-sm border border-border overflow-hidden">
                    <div className="w-full bg-surface-muted rounded-full h-2">
                        <div
                            className="bg-primary h-1 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <div className="flex border-b border-border bg-surface-muted justify-between">
                        <div className="flex overflow-x-auto hide-scrollbar">
                            {tabs.map((tab) => {
                                const hasError = hasErrorsInTab(tab.id);
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === tab.id
                                            ? "border-primary text-primary bg-surface-elevated"
                                            : "border-transparent text-fg-muted hover:text-foreground hover:border-border"
                                            } ${hasError ? "border-danger text-danger font-bold bg-danger/10" : ""}`}
                                    >
                                        {tab.label}
                                        {hasError && (
                                            <span className="text-danger" title="Contiene errores">
                                                *
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <span className="px-6 py-3 text-xs text-fg-muted mt-1 inline-block">
                            {completionPercentage}% completado
                        </span>
                    </div>

                    <div className="p-2 md:p-4 lg:p-6 bg-surface-muted min-h-120">
                        <ActivePanel />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        loadingText="Registrando..."
                        disabled={isSaving}
                    >
                        Registrar
                    </Button>
                </div>

                {successResult && (
                    <PrivatePreEnrollmentSuccessPanel
                        result={successResult}
                        previewUrl={previewUrl}
                        pdfError={pdfError}
                        isPreviewLoading={isPreviewLoading}
                        onPreview={handlePreview}
                        onDismiss={handleDismissSuccess}
                    />
                )}
            </form>
        </FormProvider>
    );
}
