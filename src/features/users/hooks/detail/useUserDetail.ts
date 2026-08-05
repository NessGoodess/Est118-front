import { useCallback, useEffect, useState } from "react";
import { getUser } from "@/features/users/services/users.service";
import type { UserDetail } from "@/features/users/types/users";
import { handleApiError } from "@/lib/api";
import type { ApiError } from "@/lib/types/auth";

export default function useUserDetail(id: string | number | null) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (id == null || id === "") return false;
    const n = typeof id === "number" ? id : parseInt(id, 10);
    return !Number.isNaN(n);
  });
  const [error, setError] = useState<ApiError | null>(null);

  const numericId =
    id == null || id === ""
      ? NaN
      : typeof id === "number"
        ? id
        : parseInt(id, 10);

  const refetch = useCallback(async () => {
    if (Number.isNaN(numericId)) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getUser(numericId);
      setUser(data);
    } catch (err) {
      setError(handleApiError(err));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { user, isLoading, error, refetch, userId: numericId };
}
