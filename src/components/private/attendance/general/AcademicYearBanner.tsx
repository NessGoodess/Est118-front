import { AcademicYearInfo } from "@/lib/types/general-attendance";

interface AcademicYearBannerProps {
    academicYear: AcademicYearInfo | null;
    activeAcademicYear: AcademicYearInfo | null;
}

export default function AcademicYearBanner({ academicYear, activeAcademicYear }: AcademicYearBannerProps) {
    if (!academicYear && !activeAcademicYear) return null;
  
    const usingFallback = academicYear?.resolved_by === "active_fallback";
    const inactiveSelected = academicYear && academicYear.is_active === false;
  
    let tone = "border-border bg-primary-soft text-primary";
    let title = `Tomando lista del ciclo ${academicYear?.description ?? "—"}`;
    let detail = activeAcademicYear
      ? `Ciclo activo del sistema: ${activeAcademicYear.description}`
      : null;
  
    if (inactiveSelected || usingFallback) {
      tone = "border-warning/30 bg-warning/10 text-warning-foreground";
      title = `Lista basada en ${academicYear?.description ?? "ciclo seleccionado"}`;
      detail = usingFallback
        ? "La fecha no coincide con un ciclo con padrón; se usa el ciclo activo."
        : activeAcademicYear
          ? `El ciclo activo es ${activeAcademicYear.description}.`
          : "Este ciclo no está marcado como activo.";
    }
  
    if (!activeAcademicYear) {
      tone = "border-danger/30 bg-danger/10 text-danger";
      title = "No hay ciclo escolar activo";
      detail = academicYear
        ? `Se está usando ${academicYear.description} para esta fecha.`
        : "Activa un ciclo escolar para operar la asistencia.";
    }
  
    return (
      <div className={`rounded-lg border px-4 py-3 text-sm ${tone}`}>
        <p className="font-medium">{title}</p>
        {detail && <p className="mt-0.5 opacity-80">{detail}</p>}
      </div>
    );
  }