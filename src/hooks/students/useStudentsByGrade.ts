import { useEffect, useState } from "react";
import { Student } from "@/lib/types/students";
import { ApiError } from "@/lib/types/auth";
import { handleApiError } from "@/lib/config/api";
import { getStudentsByGrade } from "@/lib/services/students.service";

export default function useStudentsByGrade(grade_id: number | null) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchStudents = async () => {
        if (!grade_id) return;
        try {
            const response = await getStudentsByGrade(grade_id);
            setStudents(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(handleApiError(error));
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [grade_id]);

    return {
        students,
        isLoading,
        error
    };
}