'use client';

import { useEffect, useState, useCallback } from 'react';
import { getPreEnrollments } from '@/lib/services/admissions.service';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem } from '@/lib/types/admission/preEnrollmentApi';
import { ApiError } from '@/lib/types/auth';

export function usePreEnrollments() {
  const [data, setData] =
    useState<PaginatedResponse<PreEnrollmentListItem> | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(
    async (pageToLoad = page) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPreEnrollments(pageToLoad);
        setData(result);
        setPage(pageToLoad);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return {
    // datos
    data: data?.data ?? [],
    pagination: data
      ? {
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
          hasNext: !!data.next_page_url,
          hasPrev: !!data.prev_page_url,
        }
      : null,

    // estado
    loading,
    error,
    hasError: !!error,

    // acciones
    goToPage: fetchData,
    nextPage: () =>
      data?.next_page_url && fetchData(page + 1),
    prevPage: () =>
      data?.prev_page_url && fetchData(page - 1),
    refetch: () => fetchData(page),
  };
}
