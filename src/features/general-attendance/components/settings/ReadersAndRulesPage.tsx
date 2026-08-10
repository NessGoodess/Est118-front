"use client";

import AttendanceRulesForm from "@/features/general-attendance/components/settings/AttendanceRulesForm";
import ReaderConfigPanel from "@/features/general-attendance/components/readers/ReaderConfigPanel";
import { useGeneralAttendanceCapabilities } from "@/features/general-attendance/hooks/capabilities/useGeneralAttendanceCapabilities";

/**
 * Combined tab: schedules + NFC readers.
 */
export default function ReadersAndRulesPage() {
  const { canEdit, canManageReadings } = useGeneralAttendanceCapabilities();

  if (!canEdit && !canManageReadings) {
    return (
      <p className="rounded-lg border border-border bg-surface-elevated p-6 text-sm text-fg-muted">
        No tienes permisos para gestionar horarios ni lectores.
      </p>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
      <article className="mx-auto w-full max-w-md shrink-0 min-w-0 xl:mx-0 xl:max-w-none xl:w-[min(100%,22rem)] 2xl:w-[min(100%,36rem)]">
        {canEdit ? (
          <AttendanceRulesForm />
        ) : (
          <p className="text-sm text-fg-muted">
            Sin permiso para editar horarios.
          </p>
        )}
      </article>

      <article className="min-w-0 w-full flex-1 overflow-x-auto">
        {canManageReadings ? (
          <ReaderConfigPanel />
        ) : (
          <p className="text-sm text-fg-muted">
            Sin permiso para administrar lectores.
          </p>
        )}
      </article>
    </div>
  );
}
