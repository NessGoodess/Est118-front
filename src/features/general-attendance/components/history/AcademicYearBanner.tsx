import { AcademicYearInfo } from "@/features/general-attendance/types/general-attendance";

interface AcademicYearBannerProps {
  academicYear: AcademicYearInfo | null;
  activeAcademicYear: AcademicYearInfo | null;
}

/**
 * Only shown when the selected cycle needs attention
 * (inactive, date fallback, or no active cycle).
 */
export default function AcademicYearBanner({
  academicYear,
  activeAcademicYear,
}: AcademicYearBannerProps) {
  const usingFallback = academicYear?.resolved_by === "active_fallback";
  const inactiveSelected = academicYear != null && academicYear.is_active === false;
  const noActiveCycle = !activeAcademicYear;

  if (!noActiveCycle && !inactiveSelected && !usingFallback) {
    return null;
  }

  if (!academicYear && !activeAcademicYear) {
    return null;
  }

  let tone = "border-warning/30 bg-warning/10 text-warning-foreground";
  let title = `Lista basada en ${academicYear?.description ?? "ciclo seleccionado"}`;
  let detail: string | null = usingFallback
    ? "La fecha no coincide con un ciclo con padrón; se usa el ciclo activo."
    : activeAcademicYear
      ? `El ciclo activo es ${activeAcademicYear.description}.`
      : "Este ciclo no está marcado como activo.";

  if (noActiveCycle) {
    tone = "border-danger/30 bg-danger/10 text-danger";
    title = "No hay ciclo escolar activo";
    detail = academicYear
      ? `Se está usando ${academicYear.description} para esta fecha.`
      : "Activa un ciclo escolar para operar la asistencia.";
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tone}`}>
      <p className="font-medium">{title}</p>
      {detail ? <p className="mt-0.5 opacity-80">{detail}</p> : null}
    </div>
  );
}
