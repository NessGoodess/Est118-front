import { useCallback } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { Student } from "@/features/students/types/students";
import { ApiError } from "@/lib/types/auth";
import { getStudentsByGrade } from "@/features/students/services/students.service";
import { SWR_PREFIX, keyPrefixFilter } from "@/lib/swr";

const EMPTY_STUDENTS: Student[] = [];

export const studentsByGradeKey = (gradeId: number) =>
  [SWR_PREFIX.studentsByGrade, gradeId] as const;

/**
 * Revalidates the cached student lists. Callable outside React because
 * `SWRProvider` uses the default (global) cache.
 */
export function invalidateStudentsByGradeCache(gradeId?: number) {
  if (gradeId != null) {
    void globalMutate(studentsByGradeKey(gradeId));
    return;
  }
  void globalMutate(keyPrefixFilter(SWR_PREFIX.studentsByGrade));
}

export default function useStudentsByGrade(grade_id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Student[], ApiError>(
    grade_id ? studentsByGradeKey(grade_id) : null,
    async () => (await getStudentsByGrade(grade_id!)).data ?? EMPTY_STUDENTS
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    students: data ?? EMPTY_STUDENTS,
    isLoading,
    error: error ?? null,
    refetch,
    invalidateCache: invalidateStudentsByGradeCache,
  };
}
