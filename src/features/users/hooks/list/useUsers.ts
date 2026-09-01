import { useCallback } from "react";
import useSWR from "swr";
import { getUsers } from "@/features/users/services/users.service";
import type { UserListItem } from "@/features/users/types/users";
import type { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

export type UsersListFilters = {
  role: string;
  verified: boolean | undefined;
};

/** Cache key per filter combination, so switching filters back reuses data. */
export const usersListKey = (filters: UsersListFilters) =>
  [SWR_PREFIX.usersList, filters.role, filters.verified] as const;

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
  const { data, error, isLoading, mutate } = useSWR<UserListItem[], ApiError>(
    usersListKey(filters),
    () => fetchAllUsers(filters)
  );

  const refetch = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    users: data ?? [],
    isLoading,
    error: error ?? null,
    refetch,
  };
}
