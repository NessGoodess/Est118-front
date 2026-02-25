"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useStudentEcho } from "@/hooks/useStudentsEcho";
import { globalToast } from "@/lib/toast";
import { IconByName } from "@/components/ui/icons/attendenceCard.icons";
import { getPrivateImageUrl } from "@/lib/config/api";
import { useAttendanceStore } from "@/stores/attendance-store";
import { getCurrentStudent, getAttendanceHistory } from "@/lib/services/attendance.service";
import { formatLongWithoutTime } from "@/lib/utils/dateFormatter";
import AttendanceHistoryList from "./AttendanceHistoryList";
import { ReaderStatusData } from '@/lib/types/echo'

type TypeIcon = "waiting" | "scanning" | "success" | "warning" | "error";

interface StatusConfig {
    label: string;
    color: string;
    border: string;
    text: string;
    icon: TypeIcon;
}

export default function StudentAttendanceCard() {
    const [scanStatus, setScanStatus] = useState<TypeIcon>("waiting");
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const { studentData, dataReceived, isConnected, readerStatus, isLoading, hasError } = useStudentEcho();
    const divRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Zustand store
    const { records, addRecord, setInitialRecords, getLatestRecord } = useAttendanceStore();

    const displayStudent = getLatestRecord();

    useEffect(() => {
        async function loadInitialData() {
            setIsLoadingInitial(true);
            try {
                const history = await getAttendanceHistory(20);

                if (history.length > 0) {
                    setInitialRecords(history);
                } else {
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
        ? getPrivateImageUrl(decodeURIComponent(displayStudent.photo_url))
        : "/avatar-m.svg";

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            divRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

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
                        setScanStatus("warning");
                    }, 500);
                    globalToast.warning("Advertencia", dataReceived.message || "Credencial no reconocida");
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
                    globalToast.error("Error", dataReceived.message || "Error de lectura. Intente de nuevo");
                }
                break;
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [dataReceived, studentData, addRecord]);

    const pulseAnimation = scanStatus === "scanning";

    //agregar tipoado
    const statusConfig = useMemo<StatusConfig>(() => {
        switch (scanStatus) {
            case "scanning":
                return {
                    border: "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100",
                    label: "Escaneando...",
                    text: "text-blue-600",
                    color: "bg-blue-500",
                    icon: "scanning",
                };
            case "success":
                return {
                    border: "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-100",
                    label: "Identificado",
                    text: "text-emerald-600",
                    color: "bg-emerald-500",
                    icon: "success",
                };
            case "error":
                return {
                    border: "border-red-500 bg-gradient-to-br from-red-50 to-rose-100",
                    label: "Error",
                    text: "text-red-600",
                    color: "bg-red-500",
                    icon: "error",
                };
            case "warning":
                return {
                    border: "border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100",
                    label: "Advertencia",
                    text: "text-yellow-600",
                    color: "bg-yellow-500",
                    icon: "warning",
                };
            default:
                return {
                    border: "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100",
                    label: "Esperando credencial",
                    text: "text-slate-600",
                    color: "bg-slate-400",
                    icon: "waiting",
                };
        }
    }, [scanStatus]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 items-start">
            {/* Main Card */}
            <article ref={divRef} className={`relative overflow-hidden rounded-3xl shadow-2xl border-4 transition-all duration-500 ${statusConfig.border} ${pulseAnimation ? "animate-pulse" : ""}`}>
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-linear-to-br from-white via-blue-50/50 to-indigo-50/50"></div>

                {/* Scanning progress bar */}
                {scanStatus === "scanning" && (
                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400 animate-pulse">
                        <div className="h-full bg-linear-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                )}

                <div className="relative">
                    {/* Fullscreen Button */}
                    <div className="hidden md:block absolute top-2 right-2">
                        <button
                            title={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
                            onClick={toggleFullscreen}
                            className="inline-flex items-center gap-2 px-4 py-2 transition-all duration-200 text-sm font-semibold text-slate-200 border-none"
                        >
                            <IconByName name={isFullScreen ? "exit" : "fullscreen"} className="w-5 h-5 hover:cursor-pointer hover:scale-125 hover:text-slate-50 transition-all duration-200" />
                        </button>
                    </div>
                    {/* Header */}
                    <Header statusConfig={statusConfig} isConnected={isConnected} isLoading={isLoading} hasError={hasError} isFullScreen={isFullScreen} readerStatus={readerStatus} />

                    {/* Main content */}
                    {isLoadingInitial ? (
                        <Loading />
                    ) : displayStudent ? (
                        <div className={`grid ${isFullScreen ? "grid-cols-[minmax(220px,500px)_1fr]" : "grid-cols-[minmax(220px,320px)_1fr]"} max-[900px]:grid-cols-1 gap-[clamp(1rem,3vw,3rem)] items-start p-[clamp(1rem,2vw,2rem)]`}>
                            {/* Photo Section */}
                            <div className="space-y-[clamp(0.5rem,1.5vw,1.5rem)]">

                                <div className="relative group">
                                    <div className={`aspect-square md:aspect-3/4 overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 bg-linear-to-br from-slate-200 to-slate-300 ${pulseAnimation ? "ring-4 ring-blue-400 ring-offset-4" : ""}`}>
                                        <Image
                                            src={photoUrl}
                                            alt={`Foto de ${displayStudent.name || "estudiante"}`}
                                            className="w-full h-full object-cover rounded-2xl border-2 border-slate-200"
                                            onError={(e) => ((e.target as HTMLImageElement).src = "/avatar-m.svg")}
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                    {/* Photo overlay on success */}
                                    {scanStatus === "success" && (
                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl border-4 border-emerald-400 animate-pulse"></div>
                                    )}
                                </div>
                            </div>

                            {/* Student Info Section */}
                            <div className="space-y-[clamp(0.5rem,1.5vw,1.5rem)]">

                                {/* Main info card */}
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-slate-200 space-y-2">
                                    <InfoBlock label="Nombre Completo" value={displayStudent.name} icon={<IconByName name="student" />} isFullScreen={isFullScreen} />
                                    <div className="grid grid-cols-2 gap-6">
                                        <InfoBlock label="Grado" value={displayStudent.grade} icon={<IconByName name="grade" />} isFullScreen={isFullScreen} />
                                        <InfoBlock label="Grupo" value={displayStudent.group} icon={<IconByName name="group" />} isFullScreen={isFullScreen} />
                                    </div>
                                    <InfoBlock label="ID Credencial" value={displayStudent.credential_id} icon={<IconByName name="card" />} isFullScreen={isFullScreen} />
                                </div>

                                {/* Success Message */}
                                {scanStatus === "success" && (
                                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-lg animate-slide-in">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                <IconByName name="success" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-emerald-900 mb-1">
                                                    ¡Asistencia registrada!
                                                </h4>
                                                <p className="text-sm text-emerald-700">
                                                    El estudiante ha sido identificado correctamente
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6">
                                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-700 mb-3">
                                Esperando primer escaneo
                            </h3>
                            <p className="text-slate-500 text-lg">
                                Acerque una credencial al lector NFC para iniciar
                            </p>
                        </div>
                    )}
                </div>
            </article>

            {/* History Section */}
            <article className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-x-hidden xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 sm:px-8 py-6 w-full">
                    <div className="flex items-center justify-between w-full gap-2">
                        <h3 className="flex flex-nowrap font-bold text-slate-900 text-lg">
                            Historial de Asistencia
                        </h3>
                        <span className="text-sm font-bold text-blue-900 px-2 py-0 rounded-full bg-blue-100">
                            {records.length}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600">
                        Registro cronológico de identificaciones
                    </p>
                </div>
                <div className="p-6 sm:p-8">
                    <AttendanceHistoryList records={records} loading={isLoadingInitial} />
                </div>
            </article>
        </div>

    );
}

function Header({ statusConfig, isConnected, isLoading, hasError, isFullScreen, readerStatus }: {
    statusConfig: StatusConfig;
    isConnected: boolean;
    isLoading: boolean;
    hasError: boolean;
    isFullScreen: boolean;
    readerStatus: ReaderStatusData;
}) {
    return (
        <header className="flex flex-col lg:items-center lg:justify-between gap-1 mb-2">
            {/* Title Section */}
            <div className="flex flex-col items-start gap-4 w-full 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-4 bg-blue-950 p-4 md:p-8">
                <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                    <Image src="/logo.PNG" alt="Logo header" height={100} width={100} className={`${isFullScreen ? 'w-[clamp(50px,6vw,100px)]' : 'w-[clamp(40px,6vw,50px)]'} h-auto flex-shrink-0 rounded-2xl`} />
                    <h2 className={`font-bold text-slate-50 leading-tight ${isFullScreen ? 'text-[clamp(1.8rem,4vw,3.2rem)]' : 'text-[clamp(1rem,2vw,1.5rem)]'}`}>
                        Escuela Secundaria Técnica # 118
                    </h2>
                    {/*<Image src="/Logo_IEEPO_r.png" alt="Logo" height={100} width={100} className="w-[clamp(40px,6vw,100px)] h-auto" />*/}
                </div>
                <div className="flex items-center justify-between w-full gap-4 flex-1 min-w-[200px]">
                    <p className={`text-slate-100 ${isFullScreen ? 'text-[clamp(1rem,2.5vw,2rem)]' : 'text-[clamp(0.8rem,2.5vw,1.2rem)]'}`}>
                        <DateNow />
                    </p>
                    {/* Connection Status */}
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border border-slate-200">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" :
                            isLoading ? "bg-amber-500 animate-pulse" :
                                hasError ? "bg-red-500" : "bg-slate-400"
                            }`}></div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {isConnected ? "Conectado" :
                                isLoading ? "Conectando..." :
                                    hasError ? "Error" :
                                        "Desconectado"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status and Controls */}
            <div className="hidden md:flex w-full justify-end px-4 md:px-6">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-3 py-3 px-6 rounded-xl shadow-lg border-2 transition-all ${statusConfig.border} ${statusConfig.text}`}>
                {readerStatus.connected ? (
                    <>
                        <IconByName name={statusConfig.icon} />
                        <span className={`font-bold ${isFullScreen ? 'text-[clamp(1rem,2.5vw,1.8rem)]' : 'text-[clamp(0.5rem,2vw,1rem)]'}`}>{statusConfig.label}</span>
                    </>
                    ):(
                        <>
                        <IconByName name="readerOff" className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className={`font-bold animate-pulse ${isFullScreen ? 'text-[clamp(1rem,2.5vw,1.8rem)]' : 'text-[clamp(0.5rem,2vw,1rem)]'}`}>Lector Desconectado</span>
                    </>
                    )}
                    </div>
            </div>
        </header>
    )
}

function InfoBlock({ label, value, icon, isFullScreen }: { label: string; value?: string; icon: React.ReactNode, isFullScreen: boolean }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="text-slate-400">
                    {icon}
                </div>
                <p className={`text-slate-400 uppercase tracking-wider ${isFullScreen
                    ? "text-[clamp(1rem,2vw,2rem)]"
                    : "text-[clamp(1rem,1vw,2rem)]"
                    }`}>
                    {label}
                </p>
            </div>
            <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                <p className={`font-bold text-black ${isFullScreen
                    ? "text-[clamp(1.5rem,3vw,3rem)]"
                    : "text-[clamp(1rem,1.25vw,1.5rem)]"}
                    `}>
                    {value || "No disponible"}
                </p>
            </div>
        </div>
    );
}

function Loading() {
    return (
        <div
            className=" grid grid-cols-[minmax(220px,320px)_1fr] max-[900px]:grid-cols-1 gap-[clamp(1rem,3vw,3rem)] items-start p-[clamp(1rem,2vw,2rem)]"
        >
            {/* Photo Skeleton */}
            <div className="space-y-[clamp(0.5rem,1.5vw,1.5rem)]">

                <div className="relative group">
                    <div className="aspect-3/4 overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse">
                        <Image
                            src="/avatar-m.svg"
                            fill
                            alt="Avatar"
                            className="object-cover opacity-60"
                        />
                    </div>
                </div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-[clamp(0.75rem,1.5vw,1.5rem)]">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-[clamp(1rem,2vw,2rem)] shadow-xl border border-slate-200 space-y-4">
                    <InfoBlockLoading />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.75rem,1.5vw,1.5rem)]">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <InfoBlockLoading key={index} />
                        ))}
                    </div>
                    <InfoBlockLoading />
                </div>
            </div>
        </div>
    );
}


function DateNow() {
    const date = new Date();
    return (
        <span>{formatLongWithoutTime(date)}</span>
    );
}

function InfoBlockLoading() {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="animate-pulse bg-slate-200 h-6 w-6 rounded-full"></div>
                <p className="animate-pulse bg-slate-200 h-6 w-32 lg:w-48 rounded-full"></p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200 shadow-sm">
                <p className="animate-pulse h-6 w-32 lg:w-48 rounded-full"></p>
            </div>
        </div>
    );
}