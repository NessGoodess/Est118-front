import { useCallback, useEffect, useState } from "react";
import { getUsers } from "@/features/users/services/users.service";
import type { UserListItem } from "@/features/users/types/users";
import { handleApiError } from "@/lib/api";
import type { ApiError } from "@/lib/types/auth";

export type UsersListFilters = {
  role: string;
  verified: boolean | undefined;
};

async function fetchAllUsers(filters: UsersListFilters): Promise<UserListItem[]> {
  const all: UserListItem[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const params: {
      role?: string;
      verified?: boolean;
      page?: number;
    } = { page };

    if (filters.role) params.role = filters.role;
    if (filters.verified !== undefined) params.verified = filters.verified;

    const res = await getUsers(params);
    all.push(...res.data);
    lastPage = res.last_page;
    page += 1;
  } while (page <= lastPage);

  return all;
}

export default function useUsers(filters: UsersListFilters) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers({
        role: filters.role,
        verified: filters.verified,
      });
      setUsers(data);
    } catch (err) {
      setError(handleApiError(err));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.role, filters.verified]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { users, isLoading, error, refetch };
}
