import { DataTable } from "@/components/ui/DataTable";
import { studentsTableConfig } from "./students.config";
import { tableRenderers } from "./tableRerenders";
import { tableIcons } from "./icons";
import { useMemo, useState } from "react";
import useStudentsByGrade from "@/features/students/hooks/list/useStudentsByGrade";
import { useStudentCapabilities } from "@/features/students/hooks/capabilities/useStudentCapabilities";
import { Student } from "@/features/students/types/students";
import { StudentPhotoModal } from "@/features/students/components/photo";
import { filterActionsByPermission } from "@/lib/utils/tablePermissions";

export default function StudentsByGradeSection({ grade_id }: { grade_id: number }) {
  const { students, isLoading, error, refetch } = useStudentsByGrade(grade_id);
  const { can, canManagePhoto, canViewProfile } = useStudentCapabilities();
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [photoStudent, setPhotoStudent] = useState<Student | null>(null);

  const tableConfig = useMemo(() => {
    const actions = filterActionsByPermission(studentsTableConfig.actions, can).map(
      (action) => {
        if (action.icon === "camera") {
          return {
            ...action,
            onClick: (student: Student) => setPhotoStudent(student),
          };
        }
        return action;
      }
    );

    return {
      ...studentsTableConfig,
      actions,
      features: {
        ...studentsTableConfig.features,
        rowClickable: canViewProfile && Boolean(studentsTableConfig.features?.rowClickable),
        rowClickRoute: canViewProfile
          ? studentsTableConfig.features?.rowClickRoute
          : undefined,
      },
    };
  }, [can, canViewProfile]);

  if (error) return <p>Error al cargar estudiantes</p>;

  return (
    <>
      <DataTable
        config={tableConfig}
        data={students}
        renderers={tableRenderers}
        icons={tableIcons}
        loading={isLoading}
        onSelectionChange={setSelectedStudents}
        emptyMessage="No se encontraron estudiantes"
        minRows={10}
      />

      {selectedStudents.length > 0 && (
        <div className="hidden md:block mt-4 bg-primary-soft border border-border rounded-lg p-4">
          <p className="text-sm text-primary">
            Has seleccionado {selectedStudents.length} estudiante
            {selectedStudents.length > 1 ? "s" : ""}
          </p>
        </div>
      )}

      {canManagePhoto && (
        <StudentPhotoModal
          student={photoStudent}
          isOpen={!!photoStudent}
          onClose={() => setPhotoStudent(null)}
          onSaved={refetch}
        />
      )}
    </>
  );
}
