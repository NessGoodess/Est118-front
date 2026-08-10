/**
 * Spatie permissions for school-wide (NFC) general attendance.
 *
 *  - view   → historial / roster
 *  - manage → paneles live + lectores
 *  - edit   → horarios (y futuras correcciones manuales)
 */
export const GENERAL_ATTENDANCE_PERMISSIONS = {
  view: "view general attendance",
  manage: "manage nfc readings",
  edit: "edit general attendance",
} as const;

export type GeneralAttendancePermission =
  (typeof GENERAL_ATTENDANCE_PERMISSIONS)[keyof typeof GENERAL_ATTENDANCE_PERMISSIONS];
