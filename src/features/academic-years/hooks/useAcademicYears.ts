"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { getAcademicYearsList } from "@/features/academic-years/services/academic-years.service";
import type { AcademicYearListItem } from "@/features/academic-years/types/academic-year";
import { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

export const academicYearsKey = () => [SWR_PREFIX.academicYears] as const;

export function useAcademicYears() {
  const { data, error, isLoading, mutate } = useSWR<AcademicYearListItem[], ApiError>(
    academicYearsKey(),
    getAcademicYearsList
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    data: data ?? [],
    loading: isLoading,
    error: error ?? null,
    refetch,
  };
}
