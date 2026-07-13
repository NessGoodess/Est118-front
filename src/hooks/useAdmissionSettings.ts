import { useState, useEffect, useCallback } from "react";
import { settingsService } from "@/lib/services/settings.service";
import { AdmissionCycle, CreateAdmissionCyclePayload } from "@/lib/types/admission/settings";
import { globalToast } from "@/lib/toast";
import axios from "axios";

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        if (error.code === "ERR_CANCELED") return null;
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}


export function useAdmissionCycles() {
    const [cycles, setCycles] = useState<AdmissionCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [toggling, setToggling] = useState<number | null>(null); // ID of cycle being toggled

    const loadCycles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getCycles();
            setCycles(data);
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudieron cargar los ciclos de admisión");
            if (!message) return;
            globalToast.error("Error", message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCycles();
    }, [loadCycles]);

    const createCycle = async (data: CreateAdmissionCyclePayload): Promise<AdmissionCycle | null> => {
        setCreating(true);
        try {
            const created = await settingsService.createCycle(data);
            globalToast.success("Éxito", "Ciclo creado correctamente");

            // Reload list
            await loadCycles();
            return created;
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudo crear el ciclo");
            if (!message) return null;
            globalToast.error("Error", message);
            return null;
        } finally {
            setCreating(false);
        }
    };

    const activateCycle = async (id: number) => {
        setToggling(id);
        try {
            await settingsService.activateCycle(id);
            globalToast.success("Éxito", "Ciclo activado correctamente");
            await loadCycles();
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudo activar el ciclo");
            if (!message) return;
            globalToast.error("Error", message);

        } finally {
            setToggling(null);
        }
    };

    const closeCycle = async (id: number) => {
        setToggling(id);
        try {
            await settingsService.closeCycle(id);
            globalToast.success("Éxito", "Ciclo cerrado correctamente");
            await loadCycles();
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudo cerrar el ciclo");
            if (!message) return;
            globalToast.error("Error", message);
        } finally {
            setToggling(null);
        }
    };

    const reopenCycle = async (id: number, endAt?: string) => {
        setToggling(id);
        try {
            await settingsService.reopenCycle(id, endAt);
            globalToast.success("Éxito", "Ciclo reabierto correctamente");
            await loadCycles();
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudo reabrir el ciclo");
            if (!message) return;
            globalToast.error("Error", message);
        } finally {
            setToggling(null);
        }
    };

    const deleteCycle = async (id: number) => {
        setToggling(id);
        try {
            await settingsService.deleteCycle(id);
            globalToast.success("Éxito", "Ciclo eliminado correctamente");
            await loadCycles();
        } catch (error: unknown) {
            const message = getErrorMessage(error, "No se pudo eliminar el ciclo");
            if (!message) return;
            globalToast.error("Error", message);
        } finally {
            setToggling(null);
        }
    };




    return {
        cycles,
        loading,
        creating,
        toggling,
        loadCycles,
        createCycle,
        activateCycle,
        closeCycle,
        reopenCycle,
        deleteCycle
    };
}
