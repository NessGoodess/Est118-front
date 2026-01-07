
"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useStudentEcho } from "@/hooks/useStudentsEcho";
import { CurrentStudent } from "@/lib/types/echo";
import { globalToast } from "@/lib/toast";
import Icon from "@/components/ui/Icon";

const studentInitiaLData: CurrentStudent = {
    id: 1,
    credential_id: "ROCM110926MDFMLXA6",
    name: "Areil Delgado cruz Joaquin",
    photo_url: "/Avatar.svg",
    grade: "3°",
    group: "H",
    registered_at: "DSFSDFSdfsdfsdf"
}

export default function StudentAttendanceCard() {
    const [scanStatus, setScanStatus] = useState<"waiting" | "scanning" | "success" | "error">("waiting");
    const [displayStudent, setDisplayStudent] = useState<CurrentStudent>(studentInitiaLData);
    const { studentData, dataReceived, connectionStatus, isConnected, isLoading, hasError } = useStudentEcho();
    const divRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () =>{
        if (!document.fullscreenElement) {
            divRef.current?.requestFullscreen();
        }else{
            document.exitFullscreen;
        }
    };

    useEffect(() => {

        if (!dataReceived) return

        let timeout: ReturnType<typeof setTimeout> | null = null;

        switch (dataReceived.event) {
            case "card_inserted":
                setScanStatus("scanning");
                if (dataReceived.status === "ok") {
                    timeout = setTimeout(() => {
                        setScanStatus("success");
                    }, 500)
                    if (studentData) {
                        setDisplayStudent(studentData);
                        globalToast.success("exito", "Estudiante encontrado");
                    }
                } else if (dataReceived.status === "warning") {
                    timeout = setTimeout(() => {
                        setScanStatus("error");
                    }, 500)
                    globalToast.error("Error", "Fallo al leer credencial o Credencial No reconocida,");

                }
                break

            case "card_removed":
                if (dataReceived.status === "info") {
                    setScanStatus("waiting");
                }
                break
            case "unknown":
                if (dataReceived.status === "error") {
                    setScanStatus("error");
                    globalToast.error("Error", "Error de lectura Intente de nuevo");
                }
                break
        }

        return () => {
            if (timeout) clearTimeout(timeout)
        };
    }, [dataReceived, studentData]);

    const isVisible = true
    const pulseAnimation = scanStatus === "scanning"

    const statusConfig = useMemo(() => {
        switch (scanStatus) {
            case "scanning":
                return { border: "border-blue-500 bg-blue-50", label: "Escaneando...", text: "text-blue-600", color: "bg-blue-100", textEx: "#2563eb" }
            case "success":
                return { border: "border-green-500 bg-green-50", label: "Identificado", text: "text-green-600", color: "bg-green-100", textEx: "#16a34a" }
            case "error":
                return { border: "border-red-500 bg-red-50", label: "Error", text: " text-red-600", color: "bg-red-100", textEx: "#dc2626" }
            default:
                return { border: "border-gray-200 bg-white", label: "Esperando credencial", text: " text-gray-500", color: "bg-gray-100", textEx: "#6b7280" }
        }
    }, [scanStatus])

    return (
        <div className={`transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <article className={`relative overflow-hidden rounded-2xl shadow-xl border-2 transition-all duration-300 ${statusConfig.border} ${pulseAnimation ? "animate-pulse" : ""}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80"></div>
                {scanStatus === "scanning" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-pulse"></div>
                )}

                <div ref={divRef} className="relative p-8">
                    {/* Header */}

                    <header className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sistema NFC</h2>
                                <p className="text-gray-600">Identificación de credenciales estudiantiles</p>
                            </div>

                            {/* Connection status */}
                            <div className="text-right space-y-2">
                                <div className={`flex items-center py-2 px-6 rounded-xl ${statusConfig.text} ${statusConfig.color}`}>
                                    <Icon name={scanStatus} color={statusConfig.textEx} size={28} />
                                    {statusConfig.label}
                                </div>
                                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" :
                                        isLoading ? "bg-yellow-500 animate-pulse" :
                                            hasError ? "bg-red-500" : "bg-gray-400"
                                        }`}></div>
                                    <span>
                                        {isConnected ? "Conectado" :
                                            isLoading ? "Conectando..." :
                                                hasError ? "Error de conexión" :
                                                    "Desconectado"}
                                    </span>
                                </div>
                            </div>
                            <button onClick={toggleFullscreen}>
                                Pantalla completa
                            </button>
                        </div>
                    </header>

                    {/* Main content */}
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Photo */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div className="relative group">
                                <div className={`aspect-[3/4] overflow-hidden rounded-2xl shadow-lg transition-all duration-300 bg-gray-100 ${pulseAnimation ? "ring-4 ring-blue-300 ring-opacity-50" : ""}`}>
                                    <img
                                        src={displayStudent?.photo_url || "/Avatar.svg"}
                                        alt={displayStudent?.name || "Estudiante"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => ((e.target as HTMLImageElement).src = "/Avatar.svg")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoBlock label="Nombre Completo" value={displayStudent?.name} />
                                <InfoBlock label="Grupo" value={displayStudent?.group} />
                                <InfoBlock label="Grado" value={displayStudent?.grade} />
                                <InfoBlock label="Hora de Registro" value={displayStudent?.registered_at} />
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-semibold text-gray-900 bg-gray-50 rounded-lg p-3">
                {value || "No disponible"}
            </p>
        </div>
    )
}

{/* Action Buttons 
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    disabled={!isConnected || hasError}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${!isConnected || hasError
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Confirmar Asistencia</span>
                                </button>

                                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Configurar</span>
                                </button>
                            </div>
*/}
