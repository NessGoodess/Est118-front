'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getPreEnrollments } from '@/features/admissions/services/admissions.service';
import { PaginatedResponse } from '@/lib/types/paginated-response';
import { PreEnrollmentListItem } from '@/features/admissions/types/pre-enrollment-api';
import { ApiError } from '@/lib/types/auth';
import { handleApiError } from '@/lib/api';

export function usePreEnrollments() {
  const [data, setData] = useState<PaginatedResponse<PreEnrollmentListItem> | null>(null);
  const [page, setPage] = useState(1);
  const [cycleId, setCycleIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Ref para evitar llamadas duplicadas
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (pageToLoad: number, cycleIdToLoad: number | null) => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await getPreEnrollments(pageToLoad, cycleIdToLoad);
      if (isMounted.current) {
        setData(result);
        setPage(pageToLoad);

        if (!hasLoadedOnce) {
          setHasLoadedOnce(true);
        }
      }
    } catch (error) {
      if (isMounted.current && !(error instanceof DOMException && error.name === 'AbortError')) {
        setError(handleApiError(error));
        console.error(error);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [hasLoadedOnce]);

  // Función para cambiar el ciclo
  const setCycleId = useCallback((newCycleId: number | null) => {
    setCycleIdState(newCycleId);
  }, []);

  // Función para cambiar de página
  const goToPage = useCallback((newPage: number) => {
    fetchData(newPage, cycleId);
  }, [fetchData, cycleId]);

  useEffect(() => {
    isMounted.current = true;

    fetchData(1, cycleId);

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cycleId, fetchData]);


  return {
    data: data?.data ?? [],
    pagination: data ? {
      currentPage: data.current_page,
      lastPage: data.last_page,
      total: data.total,
      from: data.from,
      to: data.to,
      perPage: data.per_page,
      hasNext: data.current_page < data.last_page,
      hasPrev: data.current_page > 1,
    } : null,
    loading,
    isInitialLoading: !hasLoadedOnce && loading,
    isRefetching: hasLoadedOnce && loading,
    error,
    hasError: !!error,
    goToPage,
    nextPage: () => data && data.current_page < data.last_page && goToPage(data.current_page + 1),
    prevPage: () => data && data.current_page > 1 && goToPage(data.current_page - 1),
    refetch: () => fetchData(page, cycleId),
    cycleId,
    setCycleId,
  };
}
