"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import {
  getAdmissionIntakeSettings,
  updateAdmissionIntakeSettings,
} from "@/features/admissions/services/intake-settings.service";
import type {
  AdmissionIntakeSettings,
  AdmissionIntakeSettingsPayload,
} from "@/features/admissions/types/intake-settings";
import { ApiError } from "@/lib/types/auth";
import { SWR_PREFIX } from "@/lib/swr";

export const intakeSettingsKey = () => [SWR_PREFIX.intakeSettings] as const;

export function useAdmissionIntakeSettings(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [saving, setSaving] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<AdmissionIntakeSettings, ApiError>(
    enabled ? intakeSettingsKey() : null,
    getAdmissionIntakeSettings
  );

  const reload = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const save = useCallback(
    async (payload: AdmissionIntakeSettingsPayload) => {
      setSaving(true);
      try {
        const next = await updateAdmissionIntakeSettings(payload);
        await mutate(next, { revalidate: false });
        return next;
      } finally {
        setSaving(false);
      }
    },
    [mutate]
  );

  return {
    data: data ?? null,
    loading: isLoading,
    saving,
    error: error ?? null,
    reload,
    save,
  };
}
