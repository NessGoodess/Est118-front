'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { handleApiError } from '@/lib/config/api';
import { ApiError } from '@/lib/types/auth';
import {
  getReEnrollmentDashboard,
  getReEnrollmentPeriods,
} from '@/lib/services/re-enrollment.service';
import {
  ReEnrollmentDashboardStats,
  ReEnrollmentPeriod,
} from '@/lib/types/school/re-enrollment';

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

export function ReEnrollmentProvider({ children }: { children: ReactNode }) {
  const [periods, setPeriods] = useState<ReEnrollmentPeriod[]>([]);
  const [activePeriodId, setActivePeriodId] = useState<number | null>(null);
  const [stats, setStats] = useState<ReEnrollmentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const activePeriod = useMemo(
    () => periods.find((p) => p.id === activePeriodId) ?? periods.find((p) => p.status === 'open') ?? periods[0] ?? null,
    [periods, activePeriodId]
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getReEnrollmentPeriods();
      setPeriods(list);

      const currentId = activePeriodId ?? list.find((p) => p.status === 'open')?.id ?? list[0]?.id ?? null;
      if (currentId && !activePeriodId) setActivePeriodId(currentId);

      if (currentId) {
        const dashboard = await getReEnrollmentDashboard(currentId);
        setStats(dashboard);
      } else {
        setStats(null);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [activePeriodId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!activePeriod?.id) return;
    getReEnrollmentDashboard(activePeriod.id)
      .then(setStats)
      .catch((err) => setError(handleApiError(err)));
  }, [activePeriod?.id]);

  return (
    <ReEnrollmentContext.Provider
      value={{
        periods,
        activePeriod,
        stats,
        loading,
        error,
        setActivePeriodId,
        refetch,
      }}
    >
      {children}
    </ReEnrollmentContext.Provider>
  );
}

export function useReEnrollment() {
  const ctx = useContext(ReEnrollmentContext);
  if (!ctx) throw new Error('useReEnrollment must be used within ReEnrollmentProvider');
  return ctx;
}
