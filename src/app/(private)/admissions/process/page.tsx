
"use client";

import AdmissionSettingsForm from "@/components/private/settings/AdmissionSettingsForm";
import GenericHeader from "@/components/ui/GenericHeader";

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <GenericHeader
                title="Configuración del Proceso de Admision"
                description="Administra los periodos de preinscripción. (Apertura Y cierre)"
            />

            <AdmissionSettingsForm />
        </div>
    );
}


