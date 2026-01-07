import { useEffect, useState } from "react";
import { Schedule } from "@/lib/types/attendance";
import { apiFetch, API_ENDPOINTS } from "@/lib/config/api";

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
      const response = await apiFetch(API_ENDPOINTS.SCHEDULES);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar horarios";
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
