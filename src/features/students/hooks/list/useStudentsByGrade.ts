import { useCallback, useEffect, useState } from "react";
import { Student } from "@/features/students/types/students";
import { ApiError } from "@/lib/types/auth";
import { handleApiError } from "@/lib/api";
import { getStudentsByGrade } from "@/features/students/services/students.service";

/** In-memory list cache keyed by grade (lives for the SPA session). */
const studentsByGradeCache = new Map<number, Student[]>();

export function invalidateStudentsByGradeCache(gradeId?: number) {
  if (gradeId != null) {
    studentsByGradeCache.delete(gradeId);
    return;
  }
  studentsByGradeCache.clear();
}

export default function useStudentsByGrade(grade_id: number | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStudents = useCallback(
    async (options?: { force?: boolean }) => {
      if (!grade_id) return;

      const force = options?.force === true;
      if (!force && studentsByGradeCache.has(grade_id)) {
        setStudents(studentsByGradeCache.get(grade_id)!);
        setError(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getStudentsByGrade(grade_id);
        const rows = response.data ?? [];
        studentsByGradeCache.set(grade_id, rows);
        setStudents(rows);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [grade_id]
  );

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  const refetch = useCallback(() => fetchStudents({ force: true }), [fetchStudents]);

  return {
    students,
    isLoading,
    error,
    refetch,
    invalidateCache: invalidateStudentsByGradeCache,
  };
}
