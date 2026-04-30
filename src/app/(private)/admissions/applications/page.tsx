//app/(private)/admissions/page.tsx

"use client"
import { useEffect } from "react";
import { usePreEnrollments } from "@/hooks/admissions/use-pre-enrollments";
import Loading from "./loading";
import { useToast } from "@/contexts/ToastContext";
import PreEnrollmentsList from "@/components/private/admission/pre-enrollments-list";
import GenericHeader from "@/components/ui/GenericHeader";

export default function Admissions() {
    const { data, loading, error } = usePreEnrollments();
    const { showError } = useToast();
    useEffect(() => {
        if (!error) return;
        showError('Error', error.message || 'Error al cargar las preinscripciones');
    }, [error, showError]);
    if (loading) return <Loading />;
    return (
        <>
            <div className="space-y-6">
                <GenericHeader title="Pre-inscripciones" description="Gestiona los aspirantes a la Institución" />
                <PreEnrollmentsList data={data} />
            </div>
        </>
    );
}



