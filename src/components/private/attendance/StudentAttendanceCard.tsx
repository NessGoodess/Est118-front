
"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useStudentEcho } from "@/hooks/useStudentsEcho";
import { CurrentStudent } from "@/lib/types/echo";
import { globalToast } from "@/lib/toast";
import Icon from "@/components/ui/Icon";
import Image from "next/image";
import { API_CONFIG } from "@/lib/config/api";
import { useAttendanceStore } from "@/stores/attendance-store";
import { getCurrentStudent, getAttendanceHistory } from "@/lib/services/attendance.service";
import AttendanceHistoryList from "./AttendanceHistoryList";

export default function StudentAttendanceCard() {
    const [scanStatus, setScanStatus] = useState<"waiting" | "scanning" | "success" | "error">("waiting");
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const { studentData, dataReceived, isConnected, isLoading, hasError } = useStudentEcho();
    const divRef = useRef<HTMLDivElement>(null);

    // Zustand store
    const { records, addRecord, setInitialRecords, getLatestRecord } = useAttendanceStore();

    // Get current display student (latest from store or null)
    const displayStudent = getLatestRecord();

    // Load initial data from API on mount
    useEffect(() => {
        async function loadInitialData() {
            setIsLoadingInitial(true);
            try {
                // Try to get attendance history first
                const history = await getAttendanceHistory(20);

                if (history.length > 0) {
                    setInitialRecords(history);
                } else {
                    // If no history, try to get current student
                    const current = await getCurrentStudent();
                    if (current) {
                        addRecord(current, 'api');
                    }
                }
            } catch (error) {
                console.error('Error loading initial attendance data:', error);
            } finally {
                setIsLoadingInitial(false);
            }
        }

        loadInitialData();
    }, [setInitialRecords, addRecord]);

    const photoUrl = displayStudent?.photo_url
        ? `${API_CONFIG.API_BASE_URL}/private-image/${displayStudent.photo_url}`
        : "/Avatar.svg";

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            divRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Handle WebSocket events
    useEffect(() => {
        if (!dataReceived) return;

        let timeout: ReturnType<typeof setTimeout> | null = null;

        switch (dataReceived.event) {
            case "card_inserted":
                setScanStatus("scanning");
                if (dataReceived.status === "ok") {
                    timeout = setTimeout(() => {
                        setScanStatus("success");
                    }, 500);
                    if (studentData) {
                        // Add to store (will prevent duplicates automatically)
                        addRecord(studentData, 'websocket');
                        globalToast.success("Éxito", "Estudiante registrado");
                    }
                } else if (dataReceived.status === "warning") {
                    timeout = setTimeout(() => {
                        setScanStatus("error");
                    }, 500);
                    globalToast.error("Error", "Credencial no reconocida");
                }
                break;

            case "card_removed":
                if (dataReceived.status === "info") {
                    setScanStatus("waiting");
                }
                break;

            case "unknown":
                if (dataReceived.status === "error") {
                    setScanStatus("error");
                    globalToast.error("Error", "Error de lectura. Intente de nuevo");
                }
                break;
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [dataReceived, studentData, addRecord]);

    const pulseAnimation = scanStatus === "scanning";

    const statusConfig = useMemo(() => {
        switch (scanStatus) {
            case "scanning":
                return { border: "border-blue-500 bg-blue-50", label: "Escaneando...", text: "text-blue-600", color: "bg-blue-100", textEx: "#2563eb" };
            case "success":
                return { border: "border-green-500 bg-green-50", label: "Identificado", text: "text-green-600", color: "bg-green-100", textEx: "#16a34a" };
            case "error":
                return { border: "border-red-500 bg-red-50", label: "Error", text: "text-red-600", color: "bg-red-100", textEx: "#dc2626" };
            default:
                return { border: "border-gray-200 bg-white", label: "Esperando credencial", text: "text-gray-500", color: "bg-gray-100", textEx: "#6b7280" };
        }
    }, [scanStatus]);

    return (
        <div className="space-y-6">
            {/* Main Card */}
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
                            <button
                                onClick={toggleFullscreen}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
                            >
                                Pantalla completa
                            </button>
                        </div>
                    </header>

                    {/* Main content */}
                    {isLoadingInitial ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                                <p className="text-gray-600">Cargando datos...</p>
                            </div>
                        </div>
                    ) : displayStudent ? (
                        <div className="flex flex-col lg:flex-row gap-8 items-center">
                            {/* Photo */}
                            <div className="w-full lg:w-80 flex-shrink-0">
                                <div className="relative group">
                                    <div className={`aspect-[3/4] overflow-hidden rounded-2xl shadow-lg transition-all duration-300 bg-gray-100 ${pulseAnimation ? "ring-4 ring-blue-300 ring-opacity-50" : ""}`}>
                                        <Image
                                            src={photoUrl}
                                            alt={displayStudent.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => ((e.target as HTMLImageElement).src = "/Avatar.svg")}
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Student Info */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoBlock label="Nombre Completo" value={displayStudent.name} />
                                    <InfoBlock label="Grupo" value={displayStudent.group} />
                                    <InfoBlock label="Grado" value={displayStudent.grade} />
                                    <InfoBlock label="ID Credencial" value={displayStudent.credential_id} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">
                                <p className="mb-2">👋 Esperando primer escaneo</p>
                                <p className="text-sm">Acerque una credencial al lector NFC</p>
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* History Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Historial de Asistencia
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {records.length} {records.length === 1 ? 'registro' : 'registros'}
                    </span>
                </div>
                <AttendanceHistoryList records={records} />
            </div>
        </div>
    );
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-semibold text-gray-900 bg-gray-50 rounded-lg p-3">
                {value || "No disponible"}
            </p>
        </div>
    );
}
