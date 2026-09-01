import { useCallback } from "react";
import useSWR from "swr";
import { getUser } from "@/features/users/services/users.service";
import type { UserDetail } from "@/features/users/types/users";
import type { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

export const userDetailKey = (id: number) => [SWR_PREFIX.userDetail, id] as const;

function toNumericId(id: string | number | null): number {
  if (id == null || id === "") return NaN;
  return typeof id === "number" ? id : parseInt(id, 10);
}

export default function useUserDetail(id: string | number | null) {
  const numericId = toNumericId(id);
  const hasId = !Number.isNaN(numericId);

  const { data, error, isLoading, mutate } = useSWR<UserDetail, ApiError>(
    hasId ? userDetailKey(numericId) : null,
    () => getUser(numericId)
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    user: data ?? null,
    isLoading,
    error: error ?? null,
    refetch,
    userId: numericId,
  };
}
