import { cache } from "react";
import type { AdmissionStatusResponse } from "../types/admission-cycles";
import { API_ENDPOINTS, buildApiUrl } from "@/lib/api";

const SERVICE_ERROR: AdmissionStatusResponse = {
  enabled: false,
  status: "service_error",
  message:
    "No pudimos consultar el estado de las preinscripciones. Intente de nuevo en unos minutos.",
  start_at: null,
  end_at: null,
  server_time: new Date().toISOString(),
  cycle_id: null,
  cycle_name: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Only open the public wizard when the API explicitly says so.
 * Any malformed / failed response must keep the form closed.
 */
export function isAdmissionFormOpen(
  status: AdmissionStatusResponse | null | undefined
): boolean {
  return status?.enabled === true && status.status === "active";
}

export function normalizeAdmissionStatus(
  raw: unknown
): AdmissionStatusResponse {
  if (!isRecord(raw)) {
    return { ...SERVICE_ERROR, server_time: new Date().toISOString() };
  }

  const statusValue = raw.status;
  const allowed = [
    "active",
    "not_started",
    "ended",
    "not_available",
    "service_error",
  ] as const;

  const status = allowed.includes(statusValue as (typeof allowed)[number])
    ? (statusValue as AdmissionStatusResponse["status"])
    : "service_error";

  const enabledFlag = raw.enabled === true;
  const enabled = enabledFlag && status === "active";

  return {
    enabled,
    status: enabled ? "active" : status === "active" ? "not_available" : status,
    message:
      typeof raw.message === "string"
        ? raw.message
        : enabled
          ? null
          : SERVICE_ERROR.message,
    start_at: typeof raw.start_at === "string" ? raw.start_at : null,
    end_at: typeof raw.end_at === "string" ? raw.end_at : null,
    server_time:
      typeof raw.server_time === "string"
        ? raw.server_time
        : new Date().toISOString(),
    cycle_id: typeof raw.cycle_id === "number" ? raw.cycle_id : null,
    cycle_name: typeof raw.cycle_name === "string" ? raw.cycle_name : null,
  };
}

async function fetchAdmissionStatus(): Promise<AdmissionStatusResponse> {
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.ADMISSION.STATUS), {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ...SERVICE_ERROR,
        message: "Servicio temporalmente no disponible. Intente más tarde.",
        server_time: new Date().toISOString(),
      };
    }

    const data: unknown = await res.json();
    return normalizeAdmissionStatus(data);
  } catch {
    return {
      ...SERVICE_ERROR,
      server_time: new Date().toISOString(),
    };
  }
}

/** Deduped per request (layout + page share one fetch). */
export const getAdmissionStatus = cache(fetchAdmissionStatus);

export function admissionNavLabel(status: AdmissionStatusResponse): string {
  if (isAdmissionFormOpen(status)) {
    return status.cycle_name?.trim() || "Preinscripciones abiertas";
  }
  if (status.status === "not_started") {
    return "Preinscripciones próximas";
  }
  if (status.status === "ended") {
    return "Preinscripciones (cerradas)";
  }
  if (status.status === "service_error") {
    return "Preinscripciones";
  }
  return "Preinscripciones";
}

export function admissionHeroCtaLabel(status: AdmissionStatusResponse): string {
  if (isAdmissionFormOpen(status)) {
    return status.cycle_name?.trim() || "Iniciar preinscripción";
  }
  if (status.status === "not_started") {
    return "Ver fechas de preinscripción";
  }
  if (status.status === "ended") {
    return "Periodo finalizado";
  }
  if (status.status === "service_error") {
    return "Consultar preinscripciones";
  }
  return "Consultar preinscripciones";
}
