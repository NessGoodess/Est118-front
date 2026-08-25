import type { AppIconName } from "@/components/ui/icons";

export function formatGender(gender: string): string {
  if (gender === "M") return "Masculino";
  if (gender === "F") return "Femenino";
  return "Otro";
}

export function formatBoolean(value: boolean): string {
  return value ? "Sí" : "No";
}

export function formatWorkshop(value: string): string {
  return value.replace(/_/g, " ");
}

export function fullName(
  first: string,
  last: string,
  secondLast?: string | null
): string {
  return [first, last, secondLast].filter(Boolean).join(" ");
}

export type PreEnrollmentStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected";

export const STATUS_CONFIG: Record<
  PreEnrollmentStatus,
  { label: string; className: string; icon: AppIconName }
> = {
  pending: {
    label: "Solicitud recibida",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
    icon: "clock",
  },
  in_review: {
    label: "En proceso",
    className: "bg-primary-soft text-primary border-border",
    icon: "clock",
  },
  approved: {
    label: "Inscrito",
    className: "bg-success/15 text-success border-success/30",
    icon: "check",
  },
  rejected: {
    label: "Rechazado",
    className: "bg-danger/15 text-danger border-danger/30",
    icon: "x",
  },
};

export function resolveStatus(status?: string): PreEnrollmentStatus {
  if (status && status in STATUS_CONFIG) {
    return status as PreEnrollmentStatus;
  }
  return "pending";
}
