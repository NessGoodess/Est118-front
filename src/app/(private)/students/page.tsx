"use client";

import { useEffect, useState } from "react";
import { useGrades, GradeLevelsCard, StudentsByGradeSection } from "@/features/students";
import { globalToast } from "@/lib/toast";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";

function AllStudentsPage() {
  const { grades, isLoading, error } = useGrades();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(1);

  useEffect(() => {
    if (error) {
      globalToast.error(error.message);
    }
  }, [error, isLoading, grades]);

  const handleGradeClick = (grade_id: number) => {
    setSelectedGrade(grade_id);
  };

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Todos Los Estudiantes"
        description="Lista de todos los estudiantes"
        isChildrenLoading={isLoading}
      >
        <div
          className="grid w-auto grid-cols-3 gap-1.5 sm:gap-2"
          role="listbox"
          aria-label="Seleccionar grado"
        >
          {grades.map((grade) => (
            <button
              type="button"
              role="option"
              aria-selected={selectedGrade === grade.grade_id}
              aria-label={`Ver estudiantes de ${grade.grade_name}`}
              key={grade.grade_id}
              onClick={() => handleGradeClick(grade.grade_id)}
              className="min-w-0 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <GradeLevelsCard {...grade} isSelected={selectedGrade === grade.grade_id} />
            </button>
          ))}

        </div>
      </GenericHeader>

      {selectedGrade && (
        <section className="rounded-lg text-foreground">
          <StudentsByGradeSection grade_id={selectedGrade} />
        </section>
      )}
    </div>
  );
}

export default withPagePermission(AllStudentsPage);
