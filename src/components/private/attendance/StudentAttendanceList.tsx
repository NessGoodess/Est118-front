"use client";

import { useGeneralAttendanceContext } from "@/contexts/GeneralAttendanceContext";
import Image from "next/image";
import { getPrivateImageProxyUrl } from "@/lib/config/api";

export default function StudentAttendanceList() {
    const { students: data, loading, error } = useGeneralAttendanceContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Cargando estudiantes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Error al cargar los datos
                        </h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes</h3>
                <p className="mt-1 text-sm text-gray-500">No se encontraron estudiantes registrados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    Lista de Estudiantes ({data.length})
                </h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((estudiante) => (
                    <div key={estudiante.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 flex-shrink-0">
                                {estudiante.photo_url ? (
                                    <Image
                                        className="rounded-full object-cover"
                                        src={getPrivateImageProxyUrl(estudiante.photo_url)}
                                        alt={estudiante.name}
                                        fill
                                        sizes="40px"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {estudiante.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {estudiante.name}
                                </p>
                                {estudiante.current_group && (
                                    <p className="text-sm text-gray-500">
                                        Grupo: {estudiante.current_group}
                                    </p>
                                )}
                                {estudiante.current_grade && (
                                    <p className="text-sm text-gray-500">
                                        Grado: {estudiante.current_grade}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}