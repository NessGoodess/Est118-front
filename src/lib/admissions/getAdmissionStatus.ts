import { getApiConfig, API_ENDPOINTS } from "@/lib/config/api";

export interface AdmissionStatusResponse {
    enabled: boolean;
    status?: "active" | "not_started" | "ended" | "not_available";
    message?: string;
    start_date?: string;
    end_date?: string;
    cycle_id?: number;
    cycle_name?: string;
}

export async function getAdmissionStatus(): Promise<AdmissionStatusResponse> {
    const { API_FULL_URL } = getApiConfig();

    try {
        const res = await fetch(
            `${API_FULL_URL}${API_ENDPOINTS.ADMISSION.STATUS}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            return {
                enabled: false,
                status: "not_available",
                message: "Servicio temporalmente no disponible",
            };
        }

        return (await res.json()) as AdmissionStatusResponse;
    } catch {
        return {
            enabled: false,
            status: "not_available",
            message: "No se pudo verificar el estado de las preinscripciones",
        };
    }
}
