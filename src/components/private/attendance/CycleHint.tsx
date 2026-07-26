import { useGeneralAttendanceContext } from "@/contexts/GeneralAttendanceContext";

export default function CycleHint() {
    const { academicYear, activeAcademicYear } = useGeneralAttendanceContext();
    if (!academicYear && !activeAcademicYear) return null;
  
    return (
      <p className="text-sm text-gray-600">
        Ciclo en uso:{" "}
        <span className="font-medium text-gray-900">
          {academicYear?.description ?? "—"}
        </span>
        {academicYear?.is_active === false && (
          <span className="ml-2 text-amber-700">(no es el ciclo activo)</span>
        )}
        {activeAcademicYear && academicYear?.id !== activeAcademicYear.id && (
          <span className="ml-2 text-gray-500">
            · Activo: {activeAcademicYear.description}
          </span>
        )}
      </p>
    );
  }