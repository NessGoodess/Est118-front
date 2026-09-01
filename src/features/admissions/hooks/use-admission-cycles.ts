'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import { getAdmissionCycles } from '@/features/admissions/services/admissions.service';
import { AdmissionCycle } from '@/features/admissions/types/pre-enrollment-api';
import { ApiError } from '@/lib/types/auth';
import { SWR_PREFIX } from '@/lib/swr';

export const admissionCyclesKey = () => [SWR_PREFIX.admissionCycles] as const;

export function useAdmissionCycles() {
  const { data, error, isLoading, mutate } = useSWR<AdmissionCycle[], ApiError>(
    admissionCyclesKey(),
    getAdmissionCycles
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    // data
    data: data ?? [],

    // state
    loading: isLoading,
    error: error ?? null,
    hasError: Boolean(error),

    // actions
    refetch,
  };
}
