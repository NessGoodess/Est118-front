"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAttendanceSettings,
  updateAttendanceSettings,
  type AttendanceSettingsPayload,
} from "@/features/general-attendance/services/attendance.service";
import type { DailyAttendanceRules } from "@/features/general-attendance/types/general-attendance";
import { attendanceSettingsSchema } from "@/features/general-attendance/schemas/attendanceSettings.schema";
import {
  DEFAULT_ATTENDANCE_SETTINGS,
  formatAttendanceSettingsError,
  lateAfterPreview,
  rulesToFormPayload,
} from "@/features/general-attendance/utils/attendanceRules";
import { globalToast } from "@/lib/toast";

type UseAttendanceRulesFormOptions = {
  onSuccess?: (rules: DailyAttendanceRules) => void;
};

export function useAttendanceRulesForm({
  onSuccess,
}: UseAttendanceRulesFormOptions = {}) {
  const [form, setForm] = useState<AttendanceSettingsPayload>(
    DEFAULT_ATTENDANCE_SETTINGS
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAttendanceSettings();
        if (!cancelled) setForm(rulesToFormPayload(data));
      } catch (err) {
        if (!cancelled) {
          globalToast.error(
            "Error al cargar horario",
            formatAttendanceSettingsError(err, "No se pudo cargar el horario")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const previewLate = useMemo(
    () =>
      lateAfterPreview(
        form.entry_time,
        Number(form.tolerance_minutes) || 0
      ),
    [form.entry_time, form.tolerance_minutes]
  );

  const onChange = useCallback(
    (key: keyof AttendanceSettingsPayload) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          key === "tolerance_minutes" ? Number(e.target.value) : e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
      },
    []
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      const parsed = attendanceSettingsSchema.safeParse({
        ...form,
        tolerance_minutes: Math.max(0, Number(form.tolerance_minutes) || 0),
      });

      if (!parsed.success) {
        const message =
          parsed.error.issues[0]?.message ?? "Revisa los datos del horario";
        globalToast.error("Error al guardar cambios", message);
        setSaving(false);
        return;
      }

      try {
        const saved = await updateAttendanceSettings(parsed.data);
        globalToast.success("Horario actualizado");
        onSuccess?.(saved);
      } catch (err: unknown) {
        const message = formatAttendanceSettingsError(err);
        globalToast.error("Error al guardar cambios", message);
      } finally {
        setSaving(false);
      }
    },
    [form, onSuccess]
  );

  return {
    form,
    loading,
    saving,
    previewLate,
    onChange,
    onSubmit,
  };
}
