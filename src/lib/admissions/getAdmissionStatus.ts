export interface AdmissionStatusResponse {
    enabled: boolean;
    status?: "active" | "not_started" | "ended" | "not_available";
    message?: string;
    start_at?: string;
    end_at?: string;
    cycle_id?: number;
    cycle_name?: string;
}

export async function getAdmissionStatus(): Promise<AdmissionStatusResponse> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admissions/status`,
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
