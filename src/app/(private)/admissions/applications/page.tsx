//app/(private)/admissions/page.tsx

"use client"
import { useEffect } from "react";

import { usePreEnrollments } from "@/hooks/admissions/use-pre-enrollments";
import { useAdmissionCycles } from "@/hooks/admissions/use-admission-cycles";
import { CardOption, CardOptionData } from "@/components/ui/CardOption";
import { formatWithoutYear } from "@/lib/utils/dateFormatter";
import { useToast } from "@/contexts/ToastContext";
import PreEnrollmentsList from "@/components/private/admission/pre-enrollments-list";
import GenericHeader from "@/components/ui/GenericHeader";
import Loading from "./loading";



export default function Admissions() {
    const { data: cycles } = useAdmissionCycles();
    const { data, isInitialLoading, isRefetching, error, cycleId, setCycleId } = usePreEnrollments();

    const { showError } = useToast();

    const activeCycleId = cycleId || cycles.find(c => c.status === 'active')?.id || cycles[0]?.id;

    useEffect(() => {
        if (!error) return;
        showError('Error', error.message || 'Error al cargar las preinscripciones');
    }, [error, showError]);

    if (isInitialLoading) {
        return <Loading />;
    }

    return (
        <>
            <div className="space-y-6">
                <GenericHeader title="Pre-inscripciones" description="Gestiona los aspirantes a la Institución" />

                <div className="w-full">
                    <div className="max-h-[480px] overflow-y-auto">
                        <div className="overflow-x-auto">
                            <div className="flex gap-3 m-2 min-w-max">
                                {cycles.map(cycle => {
                                    const cardData: CardOptionData = {
                                        id: cycle.id,
                                        title: cycle.name,
                                        subtitle: cycle.status === 'active' ? "Ciclo Activo" : cycle.status === 'closed' ? "Ciclo Cerrado" : "Borrador",
                                        status: cycle.status === 'draft' ? "upcoming" : (cycle.status as "active" | "closed"),
                                        startDate: cycle.start_at ? formatWithoutYear(cycle.start_at) : "—",
                                        endDate: cycle.end_at ? formatWithoutYear(cycle.end_at) : "—",
                                        studentCount: cycle.preenrollments_count || 0,
                                        lastFolio: cycle.last_folio_number ? `${cycle.last_folio_number.toString().padStart(4, '0')}` : "0000"
                                    };
                                    return (
                                        <CardOption
                                            key={cycle.id}
                                            data={cardData}
                                            selected={activeCycleId === cycle.id}
                                            onClick={(d) => setCycleId(activeCycleId === d.id ? null : Number(d.id))}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <PreEnrollmentsList data={data} loading={isRefetching} />
            </div>
        </>
    );
}



