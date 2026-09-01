'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { handleApiError } from '@/lib/api';
import { ApiError } from '@/lib/types/auth';
import { PendingPromotionDecisionItem } from '@/features/admissions/types/promotion';
import {
  getPendingPromotionDecisions,
  updatePromotionDecision,
} from '@/features/admissions/services/admissions.service';
import { SWR_PREFIX } from '@/lib/swr';

export const promotionDecisionsKey = () => [SWR_PREFIX.promotionDecisions] as const;

export function usePromotionDecisions() {
  const [savingId, setSavingId] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [mutationError, setMutationError] = useState<ApiError | null>(null);

  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR<PendingPromotionDecisionItem[], ApiError>(
    promotionDecisionsKey(),
    getPendingPromotionDecisions
  );

  /** Drops resolved rows from the cache without refetching the list. */
  const dropResolved = useCallback(
    (resolvedIds: Set<number>) =>
      mutate(
        (prev) => (prev ?? []).filter((item) => !resolvedIds.has(item.enrollment_id)),
        { revalidate: false }
      ),
    [mutate]
  );

  const refetch = useCallback(async () => {
    setMutationError(null);
    await mutate();
  }, [mutate]);

  const setDecision = useCallback(
    async (enrollmentId: number, isApproved: boolean): Promise<boolean> => {
      setSavingId(enrollmentId);
      setMutationError(null);

      try {
        await updatePromotionDecision(enrollmentId, isApproved);
        await dropResolved(new Set([enrollmentId]));
        return true;
      } catch (err) {
        setMutationError(handleApiError(err));
        return false;
      } finally {
        setSavingId(null);
      }
    },
    [dropResolved]
  );

  const bulkSetDecision = useCallback(
    async (
      enrollmentIds: number[],
      isApproved: boolean
    ): Promise<{ ok: number; failed: number }> => {
      if (enrollmentIds.length === 0) return { ok: 0, failed: 0 };

      setBulkLoading(true);
      setMutationError(null);

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
        await dropResolved(okIds);
      }

      return { ok: okIds.size, failed: failedIds.size };
    },
    [dropResolved]
  );

  return {
    items: data ?? [],
    loading: isLoading,
    savingId,
    bulkLoading,
    error: mutationError ?? fetchError ?? null,
    setDecision,
    bulkSetDecision,
    refetch,
  };
}
