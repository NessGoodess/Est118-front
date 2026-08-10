export type GeneralAttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "excused"
  | "pending";

export type CredentialLifecycleStatus =
  | "not_configured"
  | "configured"
  | "nfc_ready"
  | "printed"
  | "delivered"
  | "lost"
  | "replacement_pending";

export interface DailyAttendanceRules {
  timezone: string;
  entry_time: string;
  tolerance_minutes: number;
  late_after: string;
  exit_from: string;
  entry_window_closes_at: string;
}

export interface DailyAttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  pending: number;
}

export interface CredentialTrackingInfo {
  credential_printed: boolean;
  nfc_ready: boolean;
  ready_to_deliver: boolean;
  paid: boolean;
  delivered: boolean;
  lost: boolean;
  replacement_count: number;
  has_nfc_uid: boolean;
}

export interface AcademicYearInfo {
  id: number;
  description: string;
  year_start?: string | number;
  year_end?: string | number;
  is_active?: boolean;
  resolved_by?: "date" | "active" | "active_fallback" | string;
  date_cycle_id?: number | null;
  active_cycle_id?: number | null;
}

export interface DailyAttendanceStudent {
  student_id: number;
  credential_id: string | null;
  name: string;
  photo_url: string | null;
  gender: string | null;
  grade: string | null;
  group: string | null;
  status: GeneralAttendanceStatus;
  persisted_status: string | null;
  entry_at: string | null;
  exit_at: string | null;
  scanned_at: string | null;
  source: string | null;
  absence_request_id: number | null;
  credential_status: CredentialLifecycleStatus;
  credential_tracking: CredentialTrackingInfo;
}

export interface DailyAttendanceStatusRow {
  student_id: number;
  status: GeneralAttendanceStatus;
  persisted_status: string | null;
  entry_at: string | null;
  exit_at: string | null;
  scanned_at: string | null;
  source: string | null;
}

export interface DailyAttendanceResponse {
  date: string;
  academic_year: AcademicYearInfo | null;
  active_academic_year?: AcademicYearInfo | null;
  rules: DailyAttendanceRules;
  summary: DailyAttendanceSummary;
  students: DailyAttendanceStudent[];
}

export interface DailyAttendanceStatusesResponse {
  date: string;
  academic_year: AcademicYearInfo | null;
  active_academic_year?: AcademicYearInfo | null;
  rules: DailyAttendanceRules;
  summary: DailyAttendanceSummary;
  statuses: DailyAttendanceStatusRow[];
}

/** @deprecated Prefer DailyAttendanceStudent */
export interface Students {
  id: number;
  credential_id: string;
  name: string;
  current_grade: string;
  current_group: string;
  photo_url: string;
}
