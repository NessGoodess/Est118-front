import { useEffect, useState } from "react";
import { Schedule } from "@/lib/types/attendance";
import apiClient, { API_ENDPOINTS } from "@/lib/api";

interface UseSchedulesResult {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSchedules(): UseSchedulesResult {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(API_ENDPOINTS.SCHEDULES);
      const data = response.data;
      setSchedules(data.schedules || []);
    } catch (err: unknown) {
      let errorMessage = "Error al cargar horarios";
      if (err && typeof err === 'object') {
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          errorMessage = String(err.response.data.message);
        } else if ('message' in err) {
          errorMessage = String(err.message);
        }
      }
      setError(errorMessage);
      console.error("Error loading schedules:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
}
