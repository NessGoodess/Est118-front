import { useCallback } from "react";
import useSWR from "swr";
import { Schedule } from "@/lib/types/attendance";
import apiClient, { API_ENDPOINTS, handleApiError } from "@/lib/api";
import { SWR_PREFIX } from "@/lib/swr";

interface UseSchedulesResult {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY_SCHEDULES: Schedule[] = [];

export const schedulesKey = () => [SWR_PREFIX.schedules] as const;

async function fetchSchedules(): Promise<Schedule[]> {
  const response = await apiClient.get<{ schedules?: Schedule[] }>(
    API_ENDPOINTS.SCHEDULES
  );
  return response.data.schedules ?? EMPTY_SCHEDULES;
}

export function useSchedules(): UseSchedulesResult {
  const { data, error, isLoading, mutate } = useSWR<Schedule[]>(
    schedulesKey(),
    fetchSchedules
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    schedules: data ?? EMPTY_SCHEDULES,
    loading: isLoading,
    error: error ? handleApiError(error).message : null,
    refetch,
  };
}
