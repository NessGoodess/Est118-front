"use client";

import { useCallback, useState } from "react";
import { updateStudent } from "@/features/students/services/students.service";
import type { UpdateStudentPayload } from "@/features/students/schemas/student-update.schema";
import type { StudentDetailPayload } from "@/features/students/types/student-profile";
import { formatError, handleApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

export function useUpdateStudent(studentId: number, onSuccess?: (detail: StudentDetailPayload) => void) {
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (payload: UpdateStudentPayload) => {
      setSaving(true);
      try {
        const detail = await updateStudent(studentId, payload);
        showSuccess("Guardado", "Los datos del alumno se actualizaron correctamente.");
        onSuccess?.(detail);
        return detail;
      } catch (err) {
        showError("Error", formatError(handleApiError(err)));
        return null;
      } finally {
        setSaving(false);
      }
    },
    [studentId, onSuccess, showSuccess, showError]
  );

  return { save, saving };
}
