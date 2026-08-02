import ProfileSection from "./ProfileSection";
import {
  formatApproval,
  formatEnrollmentStatus,
  formatFieldValue,
  formatPlain,
  formatPromotionResult,
} from "./formatters";
import type { StudentDetailPayload } from "@/features/students/types/student-profile";

/**
 * Simple table of enrollments (no use DataTable for this table)
 */
interface StudentEnrollmentsHistoryProps {
  enrollments: StudentDetailPayload["all_enrollments"];
}

export default function StudentEnrollmentsHistory({
  enrollments,
}: StudentEnrollmentsHistoryProps) {
  const rows = Array.isArray(enrollments) ? (enrollments as Array<Record<string, unknown>>) : [];

  return (
    <ProfileSection
      title="Historial de inscripciones"
      description="Todas las filas ordenadas por fecha de registro (descendente)."
    >
      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">
              <tr>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Estado</th>
                <th className="px-3 py-3">Grado</th>
                <th className="px-3 py-3">Grupo</th>
                <th className="px-3 py-3">Ciclo</th>
                <th className="px-3 py-3">Nuevo ing.</th>
                <th className="px-3 py-3">Aprobación</th>
                <th className="px-3 py-3">Promoción</th>
                <th className="px-3 py-3">Creado</th>
                <th className="px-3 py-3">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-muted/80 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-xs">{formatPlain(row.id)}</td>
                  <td className="px-3 py-2.5">{formatEnrollmentStatus(row.status)}</td>
                  <td className="px-3 py-2.5">{formatPlain(row.grade_level)}</td>
                  <td className="px-3 py-2.5">{formatPlain(row.class_group)}</td>
                  <td className="px-3 py-2.5">{formatPlain(row.academic_year)}</td>
                  <td className="px-3 py-2.5">{formatPlain(row.is_new_admission)}</td>
                  <td className="px-3 py-2.5">{formatApproval(row.is_approved)}</td>
                  <td className="px-3 py-2.5">{formatPromotionResult(row.promotion_result)}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-fg-muted">
                    {formatFieldValue("created_at", row.created_at)}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-fg-muted">
                    {formatFieldValue("updated_at", row.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-fg-muted">Sin historial de inscripciones.</p>
      )}
    </ProfileSection>
  );
}
