"use client";

import { useCallback, useEffect, useState } from "react";
import { getPreEnrollmentById } from "@/features/admissions/services/admissions.service";
import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import { handleApiError } from "@/lib/api";
import type { ApiError } from "@/lib/types/auth";

export default function usePreEnrollmentDetail(id: string | number | null) {
  const [data, setData] = useState<PreEnrollmentApi | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (id == null || id === "") return false;
    const n = typeof id === "number" ? id : parseInt(id, 10);
    return !Number.isNaN(n);
  });
  const [error, setError] = useState<ApiError | null>(null);

  const numericId =
    id == null || id === ""
      ? NaN
      : typeof id === "number"
        ? id
        : parseInt(id, 10);

  const refetch = useCallback(async () => {
    if (Number.isNaN(numericId)) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await getPreEnrollmentById(numericId);
      setData(result);
    } catch (err) {
      setError(handleApiError(err));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data,
    setData,
    isLoading,
    error,
    refetch,
    preEnrollmentId: numericId,
  };
}
