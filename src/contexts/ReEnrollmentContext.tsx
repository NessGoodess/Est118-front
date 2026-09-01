'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import useSWR from 'swr';
import { ApiError } from '@/lib/types/auth';
import {
  getReEnrollmentDashboard,
  getReEnrollmentPeriods,
} from '@/lib/services/re-enrollment.service';
import {
  ReEnrollmentDashboardStats,
  ReEnrollmentPeriod,
} from '@/lib/types/school/re-enrollment';
import { SWR_PREFIX } from '@/lib/swr';

interface ReEnrollmentContextValue {
  periods: ReEnrollmentPeriod[];
  activePeriod: ReEnrollmentPeriod | null;
  stats: ReEnrollmentDashboardStats | null;
  loading: boolean;
  error: ApiError | null;
  setActivePeriodId: (id: number | null) => void;
  refetch: () => Promise<void>;
}

const ReEnrollmentContext = createContext<ReEnrollmentContextValue | undefined>(undefined);

export const reEnrollmentPeriodsKey = () => [SWR_PREFIX.reEnrollmentPeriods] as const;

export const reEnrollmentDashboardKey = (periodId: number) =>
  [SWR_PREFIX.reEnrollmentDashboard, periodId] as const;

export function ReEnrollmentProvider({ children }: { children: ReactNode }) {
  const [activePeriodId, setActivePeriodId] = useState<number | null>(null);

  const {
    data: periods,
    error: periodsError,
    isLoading: periodsLoading,
    mutate: mutatePeriods,
  } = useSWR<ReEnrollmentPeriod[], ApiError>(reEnrollmentPeriodsKey(), getReEnrollmentPeriods);

  /** Explicit selection wins; otherwise fall back to the open period. */
  const activePeriod = useMemo(() => {
    const list = periods ?? [];
    return (
      list.find((p) => p.id === activePeriodId) ??
      list.find((p) => p.status === 'open') ??
      list[0] ??
      null
    );
  }, [periods, activePeriodId]);

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
    mutate: mutateStats,
  } = useSWR<ReEnrollmentDashboardStats, ApiError>(
    activePeriod ? reEnrollmentDashboardKey(activePeriod.id) : null,
    () => getReEnrollmentDashboard(activePeriod!.id)
  );

  const refetch = useCallback(async () => {
    await Promise.all([mutatePeriods(), mutateStats()]);
  }, [mutatePeriods, mutateStats]);

  const value = useMemo<ReEnrollmentContextValue>(
    () => ({
      periods: periods ?? [],
      activePeriod,
      stats: stats ?? null,
      loading: periodsLoading || statsLoading,
      error: periodsError ?? statsError ?? null,
      setActivePeriodId,
      refetch,
    }),
    [
      periods,
      activePeriod,
      stats,
      periodsLoading,
      statsLoading,
      periodsError,
      statsError,
      refetch,
    ]
  );

  return (
    <ReEnrollmentContext.Provider value={value}>{children}</ReEnrollmentContext.Provider>
  );
}

export function useReEnrollment() {
  const ctx = useContext(ReEnrollmentContext);
  if (!ctx) throw new Error('useReEnrollment must be used within ReEnrollmentProvider');
  return ctx;
}
