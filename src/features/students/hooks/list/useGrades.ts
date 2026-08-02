import { getGrades } from "@/features/students/services/students.service";
import { useEffect, useState } from "react";
import { Grade, Totals } from "@/features/students/types/students";
import { handleApiError } from "@/lib/api";
import { ApiError } from "@/lib/types/auth";

const EMPTY_TOTALS: Totals = {
  total_grades: 0,
  total_students_all_grades: 0,
  total_groups: 0,
};

export default function useGrades(enabled = true) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [totals, setTotals] = useState<Totals>(EMPTY_TOTALS);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getGrades()
      .then((response) => {
        if (cancelled) return;
        setGrades(response.data.grades);
        setTotals(response.data.totals);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(handleApiError(err));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return {
    grades,
    totals,
    isLoading,
    error,
  };
}
