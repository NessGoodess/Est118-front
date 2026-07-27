'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAcademicYears } from '@/lib/services/admissions.service';
import { AcademicYearListItem } from '@/lib/types/academic-year';
import { ApiError } from '@/lib/types/auth';
import { handleApiError } from '@/lib/api';

export function useAcademicYears() {
  const [data, setData] = useState<AcademicYearListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const years = await getAcademicYears();
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

