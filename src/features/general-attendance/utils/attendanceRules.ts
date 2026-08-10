import type { AttendanceSettingsPayload } from "@/features/general-attendance/services/attendance.service";
import type { DailyAttendanceRules } from "@/features/general-attendance/types/general-attendance";

export const DEFAULT_ATTENDANCE_SETTINGS: AttendanceSettingsPayload = {
  timezone: "America/Mexico_City",
  entry_time: "07:00",
  tolerance_minutes: 10,
  exit_earliest: "13:30",
  entry_window_closes_at: "12:00",
};

/** Normalize API time (`HH:mm:ss` / `HH:mm`) for `<input type="time">`. */
export function toTimeInput(value: string | null | undefined): string {
  return value?.slice(0, 5) || "";
}

export function rulesToFormPayload(
  data: DailyAttendanceRules
): AttendanceSettingsPayload {
  return {
    timezone: data.timezone || DEFAULT_ATTENDANCE_SETTINGS.timezone,
    entry_time: toTimeInput(data.entry_time),
    tolerance_minutes: data.tolerance_minutes,
    exit_earliest: toTimeInput(data.exit_from),
    entry_window_closes_at: toTimeInput(data.entry_window_closes_at),
  };
}

/** Preview of late_after = entry_time + tolerance. */
export function lateAfterPreview(entry: string, tolerance: number): string {
  if (!/^\d{2}:\d{2}$/.test(entry)) return "—";
  const [h, m] = entry.split(":").map(Number);
  const total = h * 60 + m + Math.max(0, tolerance);
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatAttendanceSettingsError(
  err: unknown,
  fallback = "No se pudo guardar el horario"
): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (
      err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      }
    ).response?.data;
    return (
      data?.message ||
      Object.values(data?.errors ?? {})[0]?.[0] ||
      fallback
    );
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
