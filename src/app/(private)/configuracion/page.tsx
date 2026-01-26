
"use client";

import AdmissionSettingsForm from "@/components/private/settings/AdmissionSettingsForm";
import GenericHeader from "@/components/ui/GenericHeader";

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <GenericHeader title="Configuración del Sistema" description="Ajusta las configuraciones del sistema escolar." icon="" />

            <AdmissionSettingsForm />
        </div>
    );
}


