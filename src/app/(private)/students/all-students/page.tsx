"use client";

import { useEffect, useState } from "react";
import useGrades from "@/hooks/students/useGrades";
import { globalToast } from "@/lib/toast";
import GradeLevelsCard from "@/components/private/students/gradeLevelsCard";
import GenericHeader from "@/components/ui/GenericHeader";
import StudentsByGradeSection from "@/components/private/students/StudentsByGrade/StudentsByGradeSection";

export default function AllStudentsPage() {
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
            <GenericHeader title="Todos Los Estudiantes" description="Lista de todos los estudiantes" />
            <article className="text-black gap-2 md:gap-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
                {grades.map((grade) => (
                    <button
                        type="button"
                        aria-label={`Ver estudiantes de ${grade.grade_name}`}
                        key={grade.grade_id}
                        onClick={() => handleGradeClick(grade.grade_id)}
                        className={`cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
                        ${selectedGrade === grade.grade_id ? "-translate-y-0.5 shadow-xl" : ""}`}>
                        <GradeLevelsCard {...grade} isSelected={selectedGrade === grade.grade_id} />
                    </button>
                ))}
            </article>

            {selectedGrade && (
                <section className="bg-white rounded-lg shadow-md text-black p-4">
                    <StudentsByGradeSection grade_id={selectedGrade} />
                </section>
            )}
        </div>
    );
}