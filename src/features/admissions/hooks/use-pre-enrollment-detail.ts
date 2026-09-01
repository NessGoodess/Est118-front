"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { getPreEnrollmentById } from "@/features/admissions/services/admissions.service";
import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import type { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

export const preEnrollmentDetailKey = (id: number) =>
  [SWR_PREFIX.preEnrollmentDetail, id] as const;

function toNumericId(id: string | number | null): number {
  if (id == null || id === "") return NaN;
  return typeof id === "number" ? id : parseInt(id, 10);
}

export default function usePreEnrollmentDetail(id: string | number | null) {
  const numericId = toNumericId(id);
  const hasId = !Number.isNaN(numericId);

  const { data, error, isLoading, mutate } = useSWR<PreEnrollmentApi, ApiError>(
    hasId ? preEnrollmentDetailKey(numericId) : null,
    () => getPreEnrollmentById(numericId)
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  /** Writes a server response straight into the cache (no extra request). */
  const setData = useCallback(
    (next: PreEnrollmentApi | null) => {
      void mutate(next ?? undefined, { revalidate: false });
    },
    [mutate]
  );

  return {
    data: data ?? null,
    setData,
    isLoading,
    error: error ?? null,
    refetch,
    preEnrollmentId: numericId,
  };
}
