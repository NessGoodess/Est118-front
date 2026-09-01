'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { getPreEnrollments } from '@/features/admissions/services/admissions.service';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem } from '@/features/admissions/types/pre-enrollment-api';
import { ApiError } from '@/lib/types/auth';
import { SWR_PREFIX } from '@/lib/swr';

export const preEnrollmentsKey = (page: number, cycleId: number | null) =>
  [SWR_PREFIX.preEnrollments, page, cycleId] as const;

export function usePreEnrollments() {
  const [page, setPage] = useState(1);
  const [cycleId, setCycleIdState] = useState<number | null>(null);

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    PaginatedResponse<PreEnrollmentListItem>,
    ApiError
  >(preEnrollmentsKey(page, cycleId), () => getPreEnrollments(page, cycleId), {
    // Page changes keep the current rows visible instead of blanking the table.
    keepPreviousData: true,
  });

  /** Switching cycle restarts pagination. */
  const setCycleId = useCallback((newCycleId: number | null) => {
    setCycleIdState(newCycleId);
    setPage(1);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const hasData = Boolean(data);

  return {
    data: data?.data ?? [],
    pagination: data
      ? {
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
          perPage: data.per_page,
          hasNext: data.current_page < data.last_page,
          hasPrev: data.current_page > 1,
        }
      : null,
    loading: isLoading || isValidating,
    isInitialLoading: isLoading && !hasData,
    isRefetching: hasData && isValidating,
    error: error ?? null,
    hasError: Boolean(error),
    goToPage,
    nextPage: () =>
      data && data.current_page < data.last_page && goToPage(data.current_page + 1),
    prevPage: () => data && data.current_page > 1 && goToPage(data.current_page - 1),
    refetch,
    cycleId,
    setCycleId,
  };
}
