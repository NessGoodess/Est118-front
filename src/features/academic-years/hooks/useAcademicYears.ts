"use client";

import { useCallback, useEffect, useState } from "react";
import { getAcademicYearsList } from "@/features/academic-years/services/academic-years.service";
import type { AcademicYearListItem } from "@/features/academic-years/types/academic-year";
import { ApiError } from "@/lib/types/auth";
import { handleApiError } from "@/lib/api";

export function useAcademicYears() {
  const [data, setData] = useState<AcademicYearListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const years = await getAcademicYearsList();
      setData(years);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
