"use client";

import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { settingsService } from "@/lib/services/settings.service";
import { AdmissionCycle, CreateAdmissionCyclePayload } from "@/features/admissions/types/settings";
import { globalToast } from "@/lib/toast";
import axios from "axios";
import { SWR_PREFIX } from "@/lib/swr";

export const admissionSettingsCyclesKey = () =>
    [SWR_PREFIX.admissionSettingsCycles] as const;

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
    const [creating, setCreating] = useState(false);
    const [toggling, setToggling] = useState<number | null>(null); // ID of cycle being toggled

    // SWR retries transient failures, so only surface the first message of a streak.
    const lastToastedError = useRef<string | null>(null);

    const { data, isLoading, mutate } = useSWR<AdmissionCycle[]>(
        admissionSettingsCyclesKey(),
        () => settingsService.getCycles(),
        {
            onSuccess: () => {
                lastToastedError.current = null;
            },
            onError: (error) => {
                const message = getErrorMessage(error, "No se pudieron cargar los ciclos de admisión");
                if (!message || lastToastedError.current === message) return;
                lastToastedError.current = message;
                globalToast.error("Error", message);
            },
        }
    );

    const loadCycles = useCallback(async () => {
        await mutate();
    }, [mutate]);

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
        cycles: data ?? [],
        loading: isLoading,
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
