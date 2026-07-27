'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAdmissionCycles } from '@/lib/services/admissions.service';
import { AdmissionCycle } from '@/lib/types/admission/preEnrollmentApi';
import { ApiError } from '@/lib/types/auth';
import { handleApiError } from '@/lib/api';

export function useAdmissionCycles() {
  const [data, setData] = useState<AdmissionCycle[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback( async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAdmissionCycles();
        setData(result);
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    }, []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // data
    data,

    // state
    loading,
    error,
    hasError: !!error,

    // actions
    refetch: fetchData,
  };
}
