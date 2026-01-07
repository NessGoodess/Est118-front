import { Students } from "@/lib/types/general-attendance";
import apiClient, { API_ENDPOINTS } from "@/lib/config/api";
import { useState, useEffect } from "react";
import { globalToast } from "@/lib/toast/globalToast";

interface UseGeneralAttendanceResult {
    students: Students[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useGeneralAttendance(): UseGeneralAttendanceResult {
    const [students, setStudents] = useState<Students[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(API_ENDPOINTS.ALL_STUDENTS);
            setStudents(Array.isArray(response.data.students) ? response.data.students : []);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Error al obtener estudiantes";
            setError(errorMessage);
            globalToast.error("Error al obtener estudiantes:", errorMessage);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return {
        students,
        loading,
        error,
        refetch: fetchStudents,
    };
}