import ProfileSection from "./ProfileSection";
import ProfileInfoTile from "./ProfileInfoTile";
import {
  formatApproval,
  formatFieldValue,
  formatPlain,
  formatPromotionResult,
} from "./formatters";
import type { StudentDetailPayload } from "@/features/students/types/student-profile";

export default function StudentEnrollmentSection({
  enrollment,
}: {
  enrollment: StudentDetailPayload["current_enrollment"];
}) {
  return (
    <ProfileSection
      title="Matrícula vigente"
      description="Inscripción con estado activo."
    >
      {enrollment ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ProfileInfoTile label="Grado" value={formatPlain(enrollment.grade_level)} />
          <ProfileInfoTile label="Grupo" value={formatPlain(enrollment.class_group)} />
          <ProfileInfoTile label="Ciclo escolar" value={formatPlain(enrollment.academic_year)} />
          <ProfileInfoTile label="ID inscripción" value={formatPlain(enrollment.enrollment_id)} />
          <ProfileInfoTile
            label="Alta"
            value={formatFieldValue("created_at", enrollment.recorded_at)}
          />
          <ProfileInfoTile
            label="Última modificación"
            value={formatFieldValue("updated_at", enrollment.updated_at)}
          />
          <ProfileInfoTile
            label="Nuevo ingreso"
            value={formatPlain(enrollment.is_new_admission)}
          />
          <ProfileInfoTile
            label="Aprobación anual"
            value={formatApproval(enrollment.is_approved)}
          />
          <ProfileInfoTile
            label="Resultado promoción"
            value={formatPromotionResult(enrollment.promotion_result)}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
          No hay inscripción activa: el alumno no aparece enlazado a un grupo en este ciclo o falta completar la
          matrícula.
        </div>
      )}
    </ProfileSection>
  );
}
