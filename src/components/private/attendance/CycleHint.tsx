import { useGeneralAttendanceContext } from "@/contexts/GeneralAttendanceContext";

export default function CycleHint() {
    const { academicYear, activeAcademicYear } = useGeneralAttendanceContext();
    if (!academicYear && !activeAcademicYear) return null;
  
    return (
      <p className="text-sm text-fg-muted">
        Ciclo en uso:{" "}
        <span className="font-medium text-foreground">
          {academicYear?.description ?? "—"}
        </span>
        {academicYear?.is_active === false && (
          <span className="ml-2 text-warning-foreground">(no es el ciclo activo)</span>
        )}
        {activeAcademicYear && academicYear?.id !== activeAcademicYear.id && (
          <span className="ml-2 text-fg-muted">
            · Activo: {activeAcademicYear.description}
          </span>
        )}
      </p>
    );
  }