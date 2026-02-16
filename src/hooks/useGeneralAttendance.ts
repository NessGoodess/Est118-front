import { Students } from "@/lib/types/general-attendance";
import apiClient, { API_ENDPOINTS } from "@/lib/config/api";
import { useState, useEffect } from "react";
import { globalToast } from "@/lib/toast";

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
            const data = response.data?.data ?? response.data?.students ?? [];
            setStudents(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            let errorMessage = "Error al obtener estudiantes";
            if (err && typeof err === 'object') {
              if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                errorMessage = String(err.response.data.message);
              } else if ('message' in err) {
                errorMessage = String(err.message);
              }
            }
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