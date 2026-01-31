
"use client"
import GenericHeader from "@/components/ui/GenericHeader";
import { usePreEnrollments } from "@/hooks/admissions/use-pre-enrollments";
import Loading from "./loading";
import { useToast } from "@/contexts/ToastContext";
import { DataTable } from "../gestion-de-credenciales/chat-de-pruebas/page";
import { studentsTableConfig } from "@/components/private/admission/students.config";
import { tableRenderers } from "@/components/private/admission/tableRerenders";
import { tableIcons } from "@/components/private/admission/icons";
import React, { useState } from "react";


export default function Admissions() {
    const { data, loading, error } = usePreEnrollments();
    const { showError } = useToast();
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
    React.useEffect(() => {
        if (error) {
            showError('Error', 'Error al cargar las preinscripciones');
        }
    }, [error, showError]);
    if (loading) return <Loading />;
    return (
        <>
            <section className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Lista de aspirantes</h1>
                        <p className="text-slate-600">Gestiona los aspirantes a la institución</p>
                    </div>
                    <DataTable
                        config={studentsTableConfig}
                        data={data || []}
                        renderers={tableRenderers}
                        icons={tableIcons}
                        onSelectionChange={setSelectedStudents}
                        emptyMessage="No se encontraron aspirantes"
                    />

                    {selectedStudents.length > 0 && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">
                                Has seleccionado {selectedStudents.length} estudiante{selectedStudents.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </section>

        </>
    );
}



