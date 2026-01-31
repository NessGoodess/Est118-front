"use client";

import { useState } from "react";
import { useAdmissionCycles } from "@/hooks/useAdmissionSettings"; // Renamed inside logic but file is same
import { CreateAdmissionCyclePayload } from "@/lib/types/settings";
import { InputText, InputDateTime } from "@/components/ui/forms";

export default function AdmissionSettingsForm() {
    const { cycles, loading, creating, toggling, createCycle, activateCycle, closeCycle } = useAdmissionCycles();
    const [showCreate, setShowCreate] = useState(false);
    const [newCycle, setNewCycle] = useState<CreateAdmissionCyclePayload>({
        start_at: "",
        end_at: "",
        name: ""
    });

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

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6 flex justify-center items-center h-40">
                <div className="animate-pulse text-gray-500">Cargando ciclos...</div>
            </div>
        );
    }

    return (
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <header className="flex justify-between items-center">
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
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                    {showCreate ? "Cancelar" : "Nuevo Ciclo"}
                </button>
            </header>

            {showCreate && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-3">Crear Nuevo Ciclo</h3>
                    <form onSubmit={handleSubmitCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Ciclo</label>
                            <InputText
                                required
                                value={newCycle.name}
                                onChange={e => setNewCycle({ ...newCycle, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                                <InputDateTime
                                    required
                                    value={toDatetimeLocal(newCycle.start_at)}
                                    onChange={e => setNewCycle({ ...newCycle, start_at: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
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
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {creating ? "Creando..." : "Guardar Ciclo"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {cycles.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay ciclos registrados.</p>
                ) : (
                    cycles.map((cycle) => (
                        <div key={cycle.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                        Ciclo #{cycle.id}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium
                                        ${cycle.status === 'active' ? 'bg-green-100 text-green-800' :
                                            cycle.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {cycle.status === 'active' ? 'ACTIVO' : cycle.status === 'closed' ? 'CERRADO' : 'BORRADOR'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Del {new Date(cycle.start_at).toLocaleDateString()} al {new Date(cycle.end_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {cycle.status === 'draft' && (
                                    <button
                                        onClick={() => activateCycle(cycle.id)}
                                        disabled={toggling === cycle.id}
                                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200"
                                    >
                                        {toggling === cycle.id ? "..." : "Activar"}
                                    </button>
                                )}
                                {cycle.status === 'active' && (
                                    <button
                                        onClick={() => closeCycle(cycle.id)}
                                        disabled={toggling === cycle.id}
                                        className="px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200"
                                    >
                                        {toggling === cycle.id ? "..." : "Cerrar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

