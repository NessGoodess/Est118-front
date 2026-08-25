"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdmissionIntakeSettings,
  updateAdmissionIntakeSettings,
} from "@/features/admissions/services/intake-settings.service";
import type {
  AdmissionIntakeSettings,
  AdmissionIntakeSettingsPayload,
} from "@/features/admissions/types/intake-settings";
import { handleApiError } from "@/lib/api";
import { ApiError } from "@/lib/types/auth";

export function useAdmissionIntakeSettings(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<AdmissionIntakeSettings | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await getAdmissionIntakeSettings());
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async (payload: AdmissionIntakeSettingsPayload) => {
    setSaving(true);
    try {
      const next = await updateAdmissionIntakeSettings(payload);
      setData(next);
      return next;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, reload, save };
}
