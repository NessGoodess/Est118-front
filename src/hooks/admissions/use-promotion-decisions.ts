'use client';

import { useCallback, useEffect, useState } from 'react';
import { handleApiError } from '@/lib/api';
import { ApiError } from '@/lib/types/auth';
import { PendingPromotionDecisionItem } from '@/lib/types/admission/promotion';
import {
  getPendingPromotionDecisions,
  updatePromotionDecision,
} from '@/lib/services/admissions.service';

export function usePromotionDecisions() {
  const [items, setItems] = useState<PendingPromotionDecisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rows = await getPendingPromotionDecisions();
      setItems(rows);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const setDecision = useCallback(
    async (enrollmentId: number, isApproved: boolean): Promise<boolean> => {
      setSavingId(enrollmentId);
      setError(null);

      try {
        await updatePromotionDecision(enrollmentId, isApproved);
        setItems((prev) => prev.filter((item) => item.enrollment_id !== enrollmentId));
        return true;
      } catch (err) {
        setError(handleApiError(err));
        return false;
      } finally {
        setSavingId(null);
      }
    },
    []
  );

  const bulkSetDecision = useCallback(
    async (
      enrollmentIds: number[],
      isApproved: boolean
    ): Promise<{ ok: number; failed: number }> => {
      if (enrollmentIds.length === 0) return { ok: 0, failed: 0 };

      setBulkLoading(true);
      setError(null);

      const okIds = new Set<number>();
      const failedIds = new Set<number>();

      try {
        // Secuencial para evitar demasiadas requests simultáneas.
        for (const id of enrollmentIds) {
          try {
            await updatePromotionDecision(id, isApproved);
            okIds.add(id);
          } catch {
            failedIds.add(id);
          }
        }
      } finally {
        setBulkLoading(false);
      }

      if (okIds.size > 0) {
        setItems((prev) => prev.filter((item) => !okIds.has(item.enrollment_id)));
      }

      return { ok: okIds.size, failed: failedIds.size };
    },
    []
  );

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return {
    items,
    loading,
    savingId,
    bulkLoading,
    error,
    setDecision,
    bulkSetDecision,
    refetch: fetchPending,
  };
}
