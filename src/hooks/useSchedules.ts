import { useEffect, useState } from "react";
import { Schedule } from "@/lib/types/attendance";
import apiClient, { API_ENDPOINTS } from "@/lib/config/api";

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
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error al cargar horarios";
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
