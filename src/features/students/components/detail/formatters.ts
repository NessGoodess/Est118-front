import { formatMedium, formatMediumWithTime } from "@/lib/utils/dateFormatter";

/** Values of `enrollments.status` (App\Enums\EnrollmentStatus) */
const ENROLLMENT_STATUS_LABELS: Record<string, string> = {
  pre_enrolled: "Preinscrito",
  active: "Activo",
  inactive: "Inactivo",
  completed: "Finalizado",
  dropped: "Baja",
};

/** Values of `enrollments.promotion_result` (App\Enums\PromotionResult) */
const PROMOTION_RESULT_LABELS: Record<string, string> = {
  promoted: "Promovido",
  retained: "No promovido",
  graduated: "Egresado",
};

export function formatGender(g: string | null | undefined): string {
  if (!g) return "—";
  if (g === "M") return "Masculino";
  if (g === "F") return "Femenino";
  if (g === "O") return "Sin definir";
  return g;
}

export function isDateLikeKey(key: string): boolean {
  return (
    key.includes("_at") ||
    key === "birth_date" ||
    key === "recorded_at" ||
    key === "created_at" ||
    key === "updated_at"
  );
}

export function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (key === "gender" && typeof value === "string") return formatGender(value);
  if (key === "status" && typeof value === "string") return formatEnrollmentStatus(value);
  if (key === "promotion_result" && typeof value === "string") {
    return formatPromotionResult(value);
  }
  if (typeof value === "string" && isDateLikeKey(key)) {
    try {
      return key.includes("_at") && value.includes("T")
        ? formatMediumWithTime(value)
        : formatMedium(value);
    } catch {
      return String(value);
    }
  }
  if (typeof value === "object" && value !== null && "toString" in value) return String(value);
  return String(value);
}

export function formatPlain(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
}

export function formatApproval(v: unknown): string {
  if (v === null || v === undefined) return "Pendiente";
  return v === true ? "Aprobado" : "No aprobado";
}

/** Translate `enrollments.status` (active, completed, …) to Spanish label. */
export function formatEnrollmentStatus(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Activo" : "Inactivo";
  const key = String(v).trim().toLowerCase();
  return ENROLLMENT_STATUS_LABELS[key] ?? String(v);
}

/** Translate `enrollments.promotion_result` to Spanish label. */
export function formatPromotionResult(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  const key = String(v).trim().toLowerCase();
  return PROMOTION_RESULT_LABELS[key] ?? String(v);
}
