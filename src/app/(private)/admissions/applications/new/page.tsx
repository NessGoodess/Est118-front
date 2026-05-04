"use client"
import GenericHeader from "@/components/ui/GenericHeader";
import PrivatePreEnrollmentTabs from "@/components/private/admission/add/PrivatePreEnrollmentTabs";

export default function NewPreEnrollment() {
    return (
        <div className="space-y-6">
            <GenericHeader
                title="Crear Preinscripción"
                description="Ingresa los datos para una nueva preinscripción"
            />
            <div className="gap-4 p-4 rounded-xl">
                <PrivatePreEnrollmentTabs />
            </div>
        </div>
    );
}
