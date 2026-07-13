import { DataTable } from "@/components/ui/DataTable";
import {studentsTableConfig} from "./students.config";
import { tableRenderers } from "./tableRerenders";
import { tableIcons } from "./icons";
import { useMemo, useState } from "react";
import useStudentsByGrade from "@/hooks/students/useStudentsByGrade";
import { Student } from "@/lib/types/students";
import StudentPhotoModal from "./StudentPhotoModal";

export default function StudentsByGradeSection({grade_id}: {grade_id: number}) {
    const {students, isLoading, error, refetch} = useStudentsByGrade(grade_id);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [photoStudent, setPhotoStudent] = useState<Student | null>(null);
    const tableConfig = useMemo(() => ({
      ...studentsTableConfig,
      actions: studentsTableConfig.actions.map((action) => {
        if (action.icon === "camera") {
          return {
            ...action,
            onClick: (student: Student) => setPhotoStudent(student),
          };
        }
        return action;
      }),
    }), []);

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar estudiantes</p>;

    return (
        <>
              <DataTable
                config={tableConfig }
                data={students}
                renderers={tableRenderers}
                icons={tableIcons}
                onSelectionChange={setSelectedStudents}
                emptyMessage="No se encontraron estudiantes"
                minRows={10}
              />
        
              {selectedStudents.length > 0 && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    Has seleccionado {selectedStudents.length} estudiante{selectedStudents.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <StudentPhotoModal
                student={photoStudent}
                isOpen={!!photoStudent}
                onClose={() => setPhotoStudent(null)}
                onSaved={refetch}
              />
            </>
    );
}