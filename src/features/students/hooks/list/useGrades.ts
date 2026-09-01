import useSWR from "swr";
import { getGrades } from "@/features/students/services/students.service";
import { Grade, Totals } from "@/features/students/types/students";
import { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

const EMPTY_GRADES: Grade[] = [];

const EMPTY_TOTALS: Totals = {
  total_grades: 0,
  total_students_all_grades: 0,
  total_groups: 0,
};

export const gradesKey = () => [SWR_PREFIX.grades] as const;

export default function useGrades(enabled = true) {
  const { data, error, isLoading } = useSWR<{ grades: Grade[]; totals: Totals }, ApiError>(
    enabled ? gradesKey() : null,
    async () => (await getGrades()).data
  );

  return {
    grades: data?.grades ?? EMPTY_GRADES,
    totals: data?.totals ?? EMPTY_TOTALS,
    isLoading,
    error: error ?? null,
  };
}
