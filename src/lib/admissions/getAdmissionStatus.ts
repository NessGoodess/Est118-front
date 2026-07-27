import type { AdmissionStatusResponse } from "../types/admission/admissionCycles";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api";

export async function getAdmissionStatus(): Promise<AdmissionStatusResponse> {
    const fallback: AdmissionStatusResponse = {
        enabled: false,
        status: "not_available",
        message: "No se pudo verificar el estado de las preinscripciones",
        start_at: null,
        end_at: null,
        server_time: new Date().toISOString(),
        cycle_id: null,
        cycle_name: null,
    };

    try {
        const res = await fetch(buildApiUrl(API_ENDPOINTS.ADMISSION.STATUS), {
            cache: "no-store",
        });

        if (!res.ok) {
            return {
                ...fallback,
                message: "Servicio temporalmente no disponible",
            };
        }

        const data = await res.json();

        return data as AdmissionStatusResponse;
    } catch {
        return fallback;
    }
}
