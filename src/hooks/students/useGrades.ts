import { getGrades } from "@/lib/services/students.service";
import { useEffect, useState } from "react";
import { Grade, Totals } from "@/lib/types/students";
import { handleApiError } from "@/lib/config/api";
import { ApiError } from "@/lib/types/auth";

export default function useGrades() {

    const [grades, setGrades] = useState<Grade[]>([]);
    const [totals, setTotals] = useState<Totals>(
        {
            total_grades: 0,
            total_students_all_grades: 0,
            total_groups: 0
        }
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchGrades = async () => {
        try {
            const response = await getGrades();
            setGrades(response.data.grades);
            setTotals(response.data.totals);
            setIsLoading(false);
        } catch (error) {
            setError(handleApiError(error));
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    return {
        grades,
        totals,
        isLoading,
        error
    };
}