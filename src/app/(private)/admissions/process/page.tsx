
"use client";

import AdmissionSettingsForm from "@/components/private/settings/AdmissionSettingsForm";
import GenericHeader from "@/components/ui/GenericHeader";

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <GenericHeader
                title="Configuración del Proceso de Admision"
                description="Ajusta las configuraciones del formulario de preinscripción."
            />

            <AdmissionSettingsForm />
        </div>
    );
}


