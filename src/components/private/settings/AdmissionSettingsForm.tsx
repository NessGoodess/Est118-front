"use client";

import { useState } from "react";
import { useAdmissionCycles } from "@/hooks/useAdmissionSettings";
import { CreateAdmissionCyclePayload, AdmissionCycle } from "@/lib/types/settings";
import { InputText, InputDateTime } from "@/components/ui/forms";
import { useConfirm } from "@/components/ui/confirm";
import { formatWithoutYearWithTime } from "@/lib/utils/dateFormatter";

// SVG Icons
const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function AdmissionSettingsForm() {
    const { cycles, loading, creating, toggling, createCycle, activateCycle, closeCycle, reopenCycle, deleteCycle } = useAdmissionCycles();
    const { confirm } = useConfirm();
    const [showCreate, setShowCreate] = useState(false);
    const [newCycle, setNewCycle] = useState<CreateAdmissionCyclePayload>({
        start_at: "",
        end_at: "",
        name: ""
    });
    const [reopenEndDate, setReopenEndDate] = useState("");
    const [showReopenDateInput, setShowReopenDateInput] = useState(false);
    const [cycleToReopen, setCycleToReopen] = useState<AdmissionCycle | null>(null);

    function toDatetimeLocal(value?: string) {
        if (!value) return '';
        return value.replace(' ', 'T').slice(0, 16);
    }

    const handleSubmitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createCycle(newCycle);
        if (success) {
            setShowCreate(false);
            setNewCycle({ start_at: "", end_at: "", name: "" });
        }
    };

    const handleActivate = (id: number, name: string, startAt: string, endAt: string) => {
        confirm({
            title: "Activar Ciclo de Preinscripción",
            description: `¿Está seguro de activar el ciclo "${name}"?\n\nEste ciclo estará activo desde ${formatWithoutYearWithTime(startAt)} hasta ${formatWithoutYearWithTime(endAt)}.\n\nSolo puede haber un ciclo activo a la vez.\n\nLos folios comenzarán desde 001 para este nuevo ciclo.`,
            confirmLabel: "Activar",
            cancelLabel: "Cancelar",
            variant: "default",
            onConfirm: async () => {
                await activateCycle(id);
            }
        });
    };

    const handleClose = (id: number, name: string) => {
        confirm({
            title: "Cerrar Ciclo de Preinscripción",
            description: `¿Está seguro de cerrar el ciclo "${name}"?\n\nUna vez cerrado, las preinscripciones ya no estarán disponibles para el público.\n\nPuede reabrir el ciclo más tarde si es necesario.`,
            confirmLabel: "Cerrar",
            cancelLabel: "Cancelar",
            variant: "danger",
            onConfirm: async () => {
                await closeCycle(id);
            }
        });
    };

    const handleReopen = (cycle: AdmissionCycle) => {
        const now = new Date();
        const endDate = new Date(cycle.end_at);
        const isExpired = endDate < now;

        if (isExpired) {
            setCycleToReopen(cycle);
            setShowReopenDateInput(true);
            setReopenEndDate("");
        } else {
            confirm({
                title: "Reabrir Ciclo de Preinscripción",
                description: `¿Está seguro de reabrir el ciclo "${cycle.name}"?\n\nEste ciclo volverá a estar activo desde ${formatWithoutYearWithTime(cycle.start_at)} hasta ${formatWithoutYearWithTime(cycle.end_at)}.\n\nSolo puede haber un ciclo activo a la vez.\n\nLos folios continuarán donde se quedaron (último folio del ciclo).`,
                confirmLabel: "Reabrir",
                cancelLabel: "Cancelar",
                variant: "danger",
                onConfirm: async () => {
                    await reopenCycle(cycle.id);
                }
            });
        }
    };

    const handleReopenWithDate = () => {
        if (!cycleToReopen || !reopenEndDate) return;

        confirm({
            title: "Reabrir Ciclo con Nueva Fecha",
            description: `¿Está seguro de reabrir el ciclo "${cycleToReopen.name}" con nueva fecha de fin?\n\nNueva fecha de fin: ${formatWithoutYearWithTime(reopenEndDate)}\n\nSolo puede haber un ciclo activo a la vez.\n\nLos folios continuarán donde se quedaron (último folio del ciclo).`,
            confirmLabel: "Reabrir",
            cancelLabel: "Cancelar",
            variant: "danger",
            onConfirm: async () => {
                await reopenCycle(cycleToReopen.id, reopenEndDate);
                setShowReopenDateInput(false);
                setCycleToReopen(null);
                setReopenEndDate("");
            }
        });
    };

    const handleDelete = (id: number, name: string) => {
        confirm({
            title: "Eliminar Ciclo en Borrador",
            description: `¿Está seguro de eliminar el ciclo "${name}"?\n\nEsta acción no se puede deshacer.\n\nSolo se pueden eliminar ciclos en borrador que nunca han sido activados.`,
            confirmLabel: "Eliminar",
            cancelLabel: "Cancelar",
            variant: "danger",
            onConfirm: async () => {
                await deleteCycle(id);
            }
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6 flex justify-center items-center h-40">
                <div className="animate-pulse text-gray-500">Cargando ciclos...</div>
            </div>
        );
    }

    return (
        <div className="lg:flex lg:gap-6">
            {/* Main Content */}
            <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-6 lg:flex-1">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ciclos de Preinscripción
                        </h2>
                        <p className="text-sm text-gray-500">
                            Administra los ciclos de admisión (Apertura y Cierre).
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <PlusIcon />
                        {showCreate ? "Cancelar" : "Nuevo Ciclo"}
                    </button>
                </header>

                {showCreate && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <CalendarIcon />
                            Crear Nuevo Ciclo
                        </h3>
                        <form onSubmit={handleSubmitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Ciclo
                                </label>
                                <InputText
                                    required
                                    placeholder="Ej: Preinscripciones 2026"
                                    value={newCycle.name}
                                    onChange={e => setNewCycle({ ...newCycle, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Inicio
                                    </label>
                                    <InputDateTime
                                        required
                                        value={toDatetimeLocal(newCycle.start_at)}
                                        onChange={e => setNewCycle({ ...newCycle, start_at: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Fin
                                    </label>
                                    <InputDateTime
                                        required
                                        value={toDatetimeLocal(newCycle.end_at)}
                                        onChange={e => setNewCycle({ ...newCycle, end_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon />
                                            Guardar Ciclo
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reopen with Date Modal */}
                {showReopenDateInput && cycleToReopen && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
                            <WarningIcon />
                            Ciclo Expirado - Extender Fecha
                        </h3>
                        <p className="text-sm text-orange-700 mb-4">
                            El ciclo <strong>{cycleToReopen.name}</strong> ha expirado. Para reabrirlo, debe proporcionar una nueva fecha de fin.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva Fecha de Fin
                                </label>
                                <InputDateTime
                                    required
                                    value={toDatetimeLocal(reopenEndDate)}
                                    onChange={e => setReopenEndDate(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setShowReopenDateInput(false);
                                        setCycleToReopen(null);
                                        setReopenEndDate("");
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleReopenWithDate}
                                    disabled={!reopenEndDate}
                                    className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 disabled:opacity-50"
                                >
                                    Reabrir con Nueva Fecha
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {cycles.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-gray-500">No hay ciclos registrados.</p>
                            <p className="text-sm text-gray-400 mt-1">Cree un nuevo ciclo para comenzar</p>
                        </div>
                    ) : (
                        cycles.map((cycle) => {
                            const now = new Date();
                            const endDate = new Date(cycle.end_at);
                            const isExpired = endDate < now && cycle.status === 'closed';

                            return (
                                <div key={cycle.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-medium text-gray-900 text-base">
                                                    {cycle.name}
                                                </span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium
                                                    ${cycle.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        cycle.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {cycle.status === 'active' ? 'ACTIVO' : 
                                                     cycle.status === 'closed' ? 'CERRADO' : 'BORRADOR'}
                                                </span>
                                                {isExpired && (
                                                    <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-orange-100 text-orange-800">
                                                        EXPIRADO
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <p className="flex items-center gap-1">
                                                    <span className="font-medium">Inicio:</span>
                                                    {formatWithoutYearWithTime(cycle.start_at)}
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <span className="font-medium">Fin:</span>
                                                    {formatWithoutYearWithTime(cycle.end_at)}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">ID: #{cycle.id}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                            {cycle.status === 'draft' && (
                                                <>
                                                    <button
                                                        onClick={() => handleActivate(cycle.id, cycle.name, cycle.start_at, cycle.end_at)}
                                                        disabled={toggling === cycle.id}
                                                        className="px-4 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {toggling === cycle.id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-700"></div>
                                                                Activando...
                                                            </>
                                                        ) : (
                                                            "Activar"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cycle.id, cycle.name)}
                                                        disabled={toggling === cycle.id}
                                                        className="px-4 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <TrashIcon />
                                                        {toggling === cycle.id ? "Eliminando..." : "Eliminar"}
                                                    </button>
                                                </>
                                            )}
                                            {cycle.status === 'active' && (
                                                <button
                                                    onClick={() => handleClose(cycle.id, cycle.name)}
                                                    disabled={toggling === cycle.id}
                                                    className="px-4 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {toggling === cycle.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></div>
                                                            Cerrando...
                                                        </>
                                                    ) : (
                                                        "Cerrar"
                                                    )}
                                                </button>
                                            )}
                                            {cycle.status === 'closed' && (
                                                <button
                                                    onClick={() => handleReopen(cycle)}
                                                    disabled={toggling === cycle.id}
                                                    className="px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {toggling === cycle.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700"></div>
                                                            Reabriendo...
                                                        </>
                                                    ) : isExpired ? (
                                                        "Reabrir (Expirado)"
                                                    ) : (
                                                        "Reabrir"
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Sidebar for Messages/Info */}
            <aside className="mt-6 lg:mt-0 lg:w-80 space-y-4">
                {/* Cycle Status Legend */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <InfoIcon />
                        Estados del Ciclo
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-700">Activo - Ciclo en funcionamiento</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-sm text-gray-700">Borrador - Configuración pendiente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-700">Cerrado - No disponible para preinscripción</span>
                        </div>
                    </div>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <InfoIcon />
                        Información Importante
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>Solo puede haber un ciclo activo a la vez</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>Los folios se reinician al activar un nuevo ciclo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>Al reabrir un ciclo, los folios continúan secuencialmente</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>Los ciclos expirados requieren nueva fecha de fin</span>
                        </li>
                    </ul>
                </div>

                {/* Cycle Guidelines */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                        Buenas Prácticas
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div>
                            <p className="font-medium">Antes de Activar:</p>
                            <p className="text-gray-600">Verifique que las fechas sean correctas y no se solapen con otros ciclos.</p>
                        </div>
                        <div>
                            <p className="font-medium">Al Cerrar:</p>
                            <p className="text-gray-600">Asegúrese de que no haya preinscripciones pendientes de procesar.</p>
                        </div>
                        <div>
                            <p className="font-medium">Al Reabrir:</p>
                            <p className="text-gray-600">Considere extender la fecha si el ciclo ha expirado.</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}