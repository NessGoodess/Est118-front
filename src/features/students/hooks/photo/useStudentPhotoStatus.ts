"use client";

import { useCallback, useEffect, useState } from "react";
import { getStudentPhotoStatus } from "@/features/students/services/students.service";
import { handleApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import type { StudentPhotoStatus } from "@/features/students/types/photo";

export function useStudentPhotoStatus(studentId: number | null | undefined, enabled: boolean) {
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StudentPhotoStatus | null>(null);

  const reload = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await getStudentPhotoStatus(studentId);
      setStatus({
        actionLabel: res.data.action_label,
        hasPhoto: res.data.has_photo,
        currentPhotoUrl: res.data.photo_url,
      });
    } catch (err) {
      showError("Error", handleApiError(err).message || "No se pudo cargar estado de foto.");
    } finally {
      setLoading(false);
    }
  }, [studentId, showError]);

  useEffect(() => {
    if (!enabled || !studentId) return;
    reload();
  }, [enabled, studentId, reload]);

  useEffect(() => {
    if (!enabled) {
      setStatus(null);
    }
  }, [enabled]);

  return { loading, status, reload };
}
